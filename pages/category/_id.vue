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
                <v-col v-for="(item, index) in computedVideoItems" :key="index" cols="12" sm="6" md="4" lg="3" class="pa-1">
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
import RedirectMixin from "~/mixins/RedirectMixin";

export default {
  name: "Category",
  layout: "DefaultLayout",
  mixins: [ RedirectMixin ],
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
    showMoreRecentVideosButton: false,
    currentPage: 0
  }),
  head() {
    const title = this.category.name;
    const image = this.getBackgroundImage;
    return {
      title: title,
      meta: [
        { name: 'title', content: title },
        // { hid: 'description', name: 'description', content: description },

        { hid: 'og:url', name: 'og:url', content: `https://kolel.org/category/${this.category.id}` },
        { hid: 'og:title', name: 'og:title', content: title },
        { hid: 'og:site_name', name: 'og:site_name', content: title },
        
        // { hid: 'og:description', name: 'og:description', content: description },
        { hid: 'image', name: 'image', content: image, property: 'og:image' },
        { hid: 'og:image', name: 'og:image', content: image },
      ]
    };
  },
  computed: {
    getBackgroundImage() {
      return this.category && this.category.image != '' ? `url('${this.category.image}')` : `url${require('~/static/images/big/wall.jpg')}`;
    },
    computedVideoItems() {
      let itemsToShow = this.calculateItemPerRow() * this.currentPage * 6;
      return this.videoItems.slice(0, itemsToShow);
    }
  },
  methods: {
    ...mapActions("category", ["getCategoryList", "getCategoryDetail", "getCategoryVideoList"]),
    playVideo(video) {
      this.goToVideoPage(video.id);
    },

    calculateItemPerRow() {
      let itemCount = 1;
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
      let itemCount;
      if (process.browser) {
        itemCount = this.calculateItemPerRow();
      } else {
        itemCount = 4;
      }

      let limit = (itemCount * 6 * (this.currentPage + 1)) - this.videoItems.length;
      if (limit <= 0) {
        this.currentPage ++;
        return;
      }

      let payload = {
        categoryId: this.$route.params.id,
        limit: limit,
        offset: this.videoItems.length > 0 && this.videoItems[0].id == null ? 0 : this.videoItems.length
      }

      return this.getCategoryVideoList(payload).then(res => {
        let items = res.videos;
        if (this.videoItems.length > 0 && !this.videoItems[0].id) {
          this.videoItems = [ ...items];
        } else {
          this.videoItems = [...this.videoItems, ...items];
        }
        this.currentPage ++;
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

      return this.loadRecentVideos();
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
  created() {
    if (process.browser) {
      this.isMobile = window.innerWidth < 600 ? true : false;
    }
  },
  async fetch() {
    await this.initialize();
  }
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
