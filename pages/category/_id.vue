<template>
  <v-container fluid class="pt-0">
    <v-row>
      <v-col cols="12" :style="`background-image: ${getBackgroundImage};`" class="banner d-flex justify-center">
        <div class="my-auto d-flex flex-column align-center">
          <span class="name white--text mt-6">{{ category && category.name }}</span>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="2">
        <Sidebar 
          :categoryViewItems="categoryItems"
        />
      </v-col>
      <v-col cols="12" md="10">
        <v-container fluid>
          <v-row class="white">
            <v-col cols="12">
              <h2 class="heading-1">{{ $t('Recent videos') }}</h2>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col v-for="(item, index) in videoItems" :key="index" cols="12" sm="6" md="4" lg="3" class="pa-1">
                  <VideoItem :video="item" @play-video="playVideo" />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="text-center" v-if="showMoreRecentVideosButton">
              <span class="mr-4 subtitle-1 font-weight-bold" aria-controls @click="loadRecentVideos">{{ $t('Show more') }}</span>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VideoItem from "~/components/VideoItem";
import Sidebar from "~/components/Sidebar";
import { mapActions } from "vuex";

export default {
  name: "Category",
  layout: "DefaultLayout",
  components: {
    VideoItem,
    Sidebar
  },
  data: () => ({
    videoItems: [],
    breakpoints: [{
      width: 1264,
      itemsPerRow: 4
    }, {
      width: 960,
      itemsPerRow: 3
    }, {
      width: 600,
      itemsPerRow: 2
    }, {
      width: 0,
      itemsPerRow: 1
    }],
    categoryItems: [],
    isMobile: true,
    category: null,
    showMoreRecentVideosButton: false
  }),
  computed: {
    getBackgroundImage() {
      return this.category && this.category.image != '' ? `url('${this.category.image}')` : `url${require('~/static/images/big/wall.jpg')}`;
    },
  },
  methods: {
    ...mapActions("category", ["getCategoryList", "getCategoryDetail", "getCategoryVideoList"]),
    playVideo(video) {
      this.$router.push('/videos/' + video.id)
    },

    calculateItemPerRow() {
      let itemCount = 0; 
      if (process.browser) {
        for (let i = 0; i < this.breakpoints.length; i ++) {
          if (window.innerWidth > this.breakpoints[i].width && itemCount < this.breakpoints[i].itemsPerRow) {
            itemCount = this.breakpoints[i].itemsPerRow;
          }
        }
      }
      return itemCount;
    },

    loadRecentVideos() {
      let itemCount = this.calculateItemPerRow();

      let limit = itemCount * 6 - this.videoItems.length % (itemCount * 6);

      let payload = {
        categoryId: this.$route.params.id,
        limit: limit,
        offset: this.videoItems[0].id == null ? 0 : this.videoItems.length
      }

      this.getCategoryVideoList(payload).then(res => {
        let items = res.videos;
        if (!this.videoItems[0].id) {
          this.videoItems = [ ...items];
        } else {
          this.videoItems = [...this.videoItems, ...items];
        }
        if (this.videoItems.length < res.total) {
          this.showMoreRecentVideosButton = true;
        } else {
          this.showMoreRecentVideosButton = false;
        }
      })
    },

    async initialize() {
      let payload = {
        categoryId: this.$route.params.id
      }

      let res = await this.getCategoryDetail(payload);
      this.category = Object.assign({}, res.category);

      this.getCategoryList().then((res) => {
        this.categoryItems = res.categories;
      });

      this.loadRecentVideos();
    },

    showTempData() {
      let tempVideo = {
        title: null,
        channel: null,
        views: null,
        publish_time: null,
        id: null
      }
      let itemCount = this.calculateItemPerRow();
      this.videoItems = new Array(itemCount * 6).fill(tempVideo);
    }
  },
  watch: {
    "$route.params": {
      handler: function(val) {
        this.showTempData();
        this.initialize();
      },
      deep: true
    }
  },
  created() {
    if (process.browser) {
      this.isMobile = window.innerWidth < 600 ? true : false;
    }
  },
  async mounted() {
    this.showTempData();
    this.initialize();
  },
};
</script>

<style scoped>
  .banner {    
    background-size: cover;
    background-position: center;
    height: 250px;
    width: 100%;
    background-repeat: no-repeat;
  }

  .banner .name {
    font-size: 30px;
    text-shadow: 1px 1px 4px black;
  }

  ::v-deep .video-list .v-list-item {
    align-items: unset;
  }

  ::v-deep .video-list .v-list-item .v-list-item__content {
    align-self: unset;
    padding: 0;
  }

  ::v-deep .video-list .v-list-item .v-list-item__action {
    width: 140px;
    min-height: 80px;
    background: grey;
    margin-left: 20px;
  }

  .recommended-channels {
    background: #222428;
  }

  ::v-deep .side-bar .v-list-item__title {
    font-size: 22px;
  }

  .follow-section {
    position: relative;
  }

  .follow-section span {
    position: absolute;
    white-space: nowrap;
    right: 100%;
  }
</style>
