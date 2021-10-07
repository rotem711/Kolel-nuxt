<template>
  <v-container fluid class="pt-0">
    <v-row>
      <v-col cols="12" class="banner d-flex justify-center pb-16">
        <div class="mt-auto d-flex flex-column align-center pb-2">
          <v-avatar color="grey" size="160px">
            <v-img :src="channel.image"></v-img>
          </v-avatar>
          <span class="name white--text mt-2 mb-3" v-if="channel.id">{{ channel.name }}</span>
          <div class="mt-auto d-flex align-center follow-section">
            <v-btn class="my-2 px-6 text-center" :class="channel.is_following ? 'white black--text' : 'red white--text'" :disabled="!channel.id" @click="follow(!channel.is_following)">{{ channel.is_following ? $t('Unfollow') : $t('Follow') }}</v-btn>
            <span class="heading white--text mr-4 title">{{ channel.followers_count | numberDefaultFormat }} {{ $t('Followers') }} </span>
          </div>
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
          <v-row>
            <v-col cols="12" md="6" class="pa-md-0">
              <Player
                :videoUrl="selectedVideo.video_url"
                :thumbnails="thumbnails"
                :thumb_url="selectedVideo.thumb_url"
                :autoplayitem="true"
                :video="selectedVideo"
              />
            </v-col>
            <v-col cols="12" md="6" class="d-flex flex-column align-baseline">
              <div>
                <h1>{{ selectedVideo.title }}</h1>
              </div>
              <div class="mt-auto video-info" v-if="selectedVideo.id">
                <p class="mb-0">{{ channel.name }}</p>
                <p class="my-0">{{ selectedVideo.publish_time | fromNow }} <span class="mx-0">&#183;</span> {{ selectedVideo.views | formatViews }} {{ $t('views') }} </p>
              </div>
            </v-col>
          </v-row>
          <v-row class="white mt-10">
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
              <span class="mr-4 subtitle-1 font-weight-bold" aria-controls @click="showRecentVideos">{{ $t('Show more') }}</span>
            </v-col>
          </v-row>
          
          <v-row class="white mt-4">
            <v-col cols="12">
              <h2 class="heading-1">{{ $t('Most viewed') }}</h2>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col v-for="(item, index) in mostViewed" :key="index" cols="12" sm="6" md="4" lg="3" class="pa-1">
                  <VideoItem :video="item" @play-video="playVideo" />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="text-center" v-if="showMoreMostViewedButton">
              <span class="mr-4 subtitle-1 font-weight-bold" aria-controls @click="showMostViewedVideos">{{ $t('Show more') }}</span>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import VideoItem from "@/components/VideoItem";
import Player from "@/components/Player";
import Sidebar from "@/components/Sidebar";
import RedirectMixin from "~/mixins/RedirectMixin";
import { mapActions } from "vuex";

export default {
  name: "Channel",
  layout: "DefaultLayout",
  mixins: [ RedirectMixin ],
  components: {
    Player,
    VideoItem,
    Sidebar
  },
  data: () => ({
    channel: {},
    item: null,
    videoItems: [],
    mostViewed: [],
    selectedVideo: {},
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
    thumbnails: {
      0: {
        src: "https://homepages.cae.wisc.edu/~ece533/images/baboon.png",
        style: {
          left: "-60px",
          width: "600px",
          height: "68px",
          clip: "rect(0, 120px, 68px, 0)"
        }
      },
      10: {
        style: {
          left: "-180px",
          clip: "rect(0, 240px, 68px, 120px)"
        }
      },
      20: {
        style: {
          left: "-300px",
          clip: "rect(0, 360px, 68px, 240px)"
        }
      },
      30: {
        style: {
          left: "-420px",
          clip: "rect(0, 480px, 68px, 360px)"
        }
      },
      40: {
        style: {
          left: "-540px",
          clip: "rect(0, 600px, 68px, 480px)"
        }
      }
    },
    categoryItems: [],
    isMobile: true,
    showMoreMostViewedButton: false,
    showMoreRecentVideosButton: false,
    mostViewedPage: 0,
    recentVideoPage: 0
  }),
  head() {
    const title = this.channel.name;
    const image = this.channel.image;
    return {
      title: title,
      meta: [
        { name: 'title', content: title },
        // { hid: 'description', name: 'description', content: description },

        { hid: 'og:url', name: 'og:url', content: `https://kolel.org/channel/${this.channel.id}` },
        { hid: 'og:title', name: 'og:title', content: title },
        { hid: 'og:site_name', name: 'og:site_name', content: title },
        
        // { hid: 'og:description', name: 'og:description', content: description },
        { hid: 'image', name: 'image', content: image, property: 'og:image' },
        { hid: 'og:image', name: 'og:image', content: image },
      ]
    };
  },
  methods: {
    ...mapActions('video', ['getVideoList']),
    ...mapActions('channel', ['getChannelDetail', 'getChannelVideoList', 'followChannel']),
    ...mapActions("category", ["getCategoryList"]),
    playVideo(video) {
      this.goToVideoPage(video.id);
    },

    showRecentVideos() {
      let itemCount;

      if (process.browser) {
        itemCount = this.calculateItemPerRow();
      } else {
        itemCount = 4;
      }

      let limit = itemCount * 3 * (this.recentVideoPage + 1) - this.videoItems.length;

      let payload = {
        channelId: this.$route.params.id,
        limit: limit,
        offset: this.videoItems.length > 0 && this.videoItems[0].id == null ? 0 : this.videoItems.length,
      }

      return this.getChannelVideoList(payload).then(res => {
        let items = res.videos;
        items = items.map(item => ({
          ...item,
          channel: this.channel
        }));
        if (this.videoItems.length > 0 && !this.videoItems[0].id) {
          this.videoItems = [ ...items];
        } else {
          this.videoItems = [...this.videoItems, ...items];
        }
        this.recentVideoPage ++;
        if (this.videoItems.length < res.total) {
          this.showMoreRecentVideosButton = true;
        } else {
          this.showMoreRecentVideosButton = false;
        }
        this.selectedVideo = this.selectedVideo ? this.videoItems[0] : this.selectedVideo;
      })
    },

    follow(value) {
      let payload = {
        channelId: this.channel.id,
        follow: value
      }

      this.followChannel(payload).then(res => {
        if (res) {
          this.channel.is_following = value;
        }
      })
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

    showMostViewedVideos() {
      let itemCount;

      if (process.browser) {
        itemCount = this.calculateItemPerRow();
      } else {
        itemCount = 4;
      }

      let limit = itemCount * 3 * (this.mostViewedPage + 1) - this.mostViewed.length;

      let mostViewedPayload = {
        limit: limit,
        offset: this.mostViewed.length > 0 && this.mostViewed[0].id == null ? 0 : this.mostViewed.length,
        sort_by: 'views',
        channel_id: this.$route.params.id
      }

      return this.getVideoList(mostViewedPayload).then(res => {
        let items = res.videos;
        items = items.map(item => ({
          ...item,
          channel: this.channel
        }));
        if (this.mostViewed.length > 0 && !this.mostViewed[0].id) {
          this.mostViewed = [ ...items];
        } else {
          this.mostViewed = [...this.mostViewed, ...items];
        }
        this.mostViewedPage ++;
        if (this.mostViewed.length < res.total) {
          this.showMoreMostViewedButton = true;
        } else {
          this.showMoreMostViewedButton = false;
        }
      })
    },

    async initialize() {
      let payload = {
        channelId: this.$route.params.id
      }

      let res = await this.getChannelDetail(payload);
      this.channel = res.channels;

      res = await this.getCategoryList();
      this.categoryItems = res.categories;

      await this.showRecentVideos();

      return this.showMostViewedVideos();

      // return Promise.all([this.showRecentVideos, this.showMostViewedVideos]);
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
      this.videoItems = new Array(itemCount * 3).fill(tempVideo);
      this.mostViewed = new Array(itemCount * 3).fill(tempVideo);
    }
  },
  created() {
    this.showTempData();
    if (process.browser) {
      this.isMobile = window.innerWidth < 600 ? true : false;
    }
  },
  async fetch() {
    await this.initialize();
  },
};
</script>

<style scoped>
  .banner {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('~/static/images/big/wall.jpg');
    height: 500px;
    width: 100%;
    background-repeat: no-repeat;
    background-size: cover;
  }

  .banner .name {
    font-size: 40px;
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

  .video-info {
    color: #5a5a5a!important;
  }
</style>
