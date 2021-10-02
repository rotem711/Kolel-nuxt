<template>
  <v-container fluid class="pt-0 pt-md-10">
    <v-row class="pt-0">
      <v-col cols="12" md="2">
        <Sidebar :categoryViewItems="categoryItems" />
      </v-col>
      <v-col cols="12" md="10">
        <v-container fluid class="pt-0">
          <v-row class="pt-0 d-none d-md-flex">
            <v-col cols="12" md="7" lg="8" xl="9">
              <Player
                :videoUrl="selectedVideo ? selectedVideo.video_url : null"
                :thumbnails="thumbnails"
                :thumb_url="selectedVideo ? selectedVideo.thumb_url : null"
                @reset-height="resetHeight"
                :video="selectedVideo"
              />
              <div>
                <h4 class="mt-2">{{ selectedVideo && selectedVideo.title }}</h4>
              </div>
              <div class="video-info d-flex justify-space-between align-center">
                <p class="my-0 subtitle-2">{{ selectedVideo && selectedVideo.views | formatViews }} {{ $t('views') }} <span class="mx-0">&#183;</span> {{ selectedVideo && selectedVideo.publish_time | fromNow }}</p>
                <v-btn :disabled="!selectedVideo || !selectedVideo.id" @click="shareDialog = true" outlined><v-icon class="ml-2" text>mdi-cloud-upload-outline</v-icon>{{ $t("Sharing") }}</v-btn>
              </div>
            </v-col>
            <v-col cols="12" md="5" lg="4" xl="3">
              <v-list two-line color="transparent" class="video-list pa-0">
                <v-list-item
                  v-for="(item, i) in recommendedVideoItems"
                  :key="i"
                  aria-controls
                  class="px-md-0"
                >
                  <v-list-item-action class="mt-0" @click="playVideo(item)">
                    <v-img
                      :src="item && item.thumb_url"
                      max-width="170"
                      min-width="170"
                      :contain="true"
                      :aspect-ratio="1.7778"
                    >
                      <template v-slot:placeholder>
                        <v-row
                          class="fill-height ma-0"
                          align="center"
                          justify="center"
                        >
                          <img src="~/static/placeholder.webp" width="100%" height="100%" />
                        </v-row>
                      </template>
                    </v-img>
                  </v-list-item-action>

                  <v-list-item-content>
                    <v-list-item-title @click="playVideo(item)">
                      {{ item.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle
                      @click="
                        $router.push({
                          name: 'Channel',
                          params: { id: item.channel.id },
                        })
                      "
                    >
                      <span>{{ item.channel.name }} </span> <br />
                      {{ item.publish_time | fromNow }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
          <v-row class="white mt-10">
            <template v-if="user">
              <v-col cols="12">
                <h2 class="heading-1">{{ $t("Favorites") }}</h2>
              </v-col>
              <v-col cols="12">
                <!-- <client-only>
                  <slick :options="slickSettings" :key="'favorite' + favorites.length">
                    <div
                      v-for="(item, index) in favorites"
                      :key="'favorite' + favorites.length + item.id + '-' + index"
                      class="px-1"
                    >
                      <VideoItem :video="item" @play-video="viewVideo" />
                    </div>
                  </slick>
                </client-only> -->
                <!-- <client-only>
                  <VueSlickCarousel v-bind="slickSettings" :key="'favorite' + favorites.length">
                    <div
                      v-for="(item, index) in favorites"
                      :key="'favorite' + favorites.length + item.id + '-' + index"
                      class="px-1"
                    >
                      <VideoItem :video="item" @play-video="viewVideo" />
                    </div>
                  </VueSlickCarousel>
                </client-only> -->
              </v-col>
            </template>
            <v-col cols="12">
              <h2 class="heading-1">{{ $t("Popular") }}</h2>
            </v-col>
            <v-col cols="12" class="popular-video-list">
              <!-- <client-only> -->
                <VueSlickCarousel
                  v-bind="popularSlickSettings"
                  :ref="'popular'"
                  :key="'popular' + computedPopularItems.length"
                >
                  <div
                    v-for="(item, index) in computedPopularItems"
                    :key="item.id + '-' + index"
                    class="px-1"
                  >
                    <VideoItem :video="item" @play-video="viewVideo" />
                  </div>
                </VueSlickCarousel>
              <!-- </client-only> -->
            </v-col>
            <template
              v-for="(category, categoryIndex) in categoryVideos.slice(0, 2)"
            >
              <v-col
                cols="12"
                :key="category.category.id + 'popular' + categoryIndex"
              >
                <h2 class="heading-1" v-if="category.category.id">
                  <span
                    aria-controls
                    @click="goToCategory(category.category.id)"
                  >{{ category.category.name }}
                  </span>
                  <span
                    class="mr-4 subtitle-1 blue--text"
                    aria-controls
                    @click="goToCategory(category.category.id)"
                  >
                    {{ $t("Show all") }}
                  </span>
                </h2>
              </v-col>
              <v-col
                cols="12"
                class=""
                :key="'popularvideo' + category.category.id + categoryIndex"
                v-if="category.videos.length > 0"
              >
                <client-only>
                  <VueSlickCarousel
                    v-bind="slickSettings"
                    @afterChange="
                      ($event) =>
                        slickCarouselChanged($event, category.category.id)
                    "
                    :ref="'categorycarousel' + category.category.id"
                    :key="'popularvideo' + category.category.id + categoryIndex + category.videos.length"
                  >
                    <div
                      v-for="(item, index) in category.videos"
                      :key="item.id + '-' + index"
                      class="px-1"
                    >
                      <VideoItem :video="item" @play-video="viewVideo" />
                    </div>
                  </VueSlickCarousel>
                </client-only>
              </v-col>
            </template>
          </v-row>
          <v-row class="recommended-channels">
            <v-col cols="12">
              <h2 class="heading white--text">
                {{ $t("Recommended channels") }}
              </h2>
            </v-col>
            <v-col cols="12" v-if="recommendedChannels.length > 0">
              <client-only>
                <VueSlickCarousel v-bind="channelSlickSettings">
                  <div
                    v-for="(item, index) in recommendedChannels"
                    :key="'recommendedchannel' + index"
                  >
                    <RecommendedChannel :channel="item" />
                  </div>
                </VueSlickCarousel>
              </client-only>
            </v-col>
          </v-row>
          <v-row class="white">
            <template v-for="(category, categoryIndex) in categoryVideos.slice(2, 99)">
              <v-col cols="12" :key="'category' + categoryIndex + category.category.id">
                <h2 class="heading-1" v-if="category.category.id">
                  <span
                    aria-controls
                    @click="goToCategory(category.category.id)"
                    >{{ category.category.name }}
                  </span>
                  <span
                    class="mr-4 subtitle-1 blue--text"
                    aria-controls
                    @click="goToCategory(category.category.id)"
                  >
                    {{ $t("Show all") }}
                  </span>
                </h2>
              </v-col>
              <v-col
                cols="12"
                class=""
                :key="'categoryvideo' + categoryIndex + category.category.id"
              >
                <client-only>
                  <VueSlickCarousel
                    v-bind="slickSettings"
                    @afterChange="
                      ($event) =>
                        slickCarouselChanged($event, category.category.id)
                    "
                    :ref="'categorycarousel' + category.category.id"
                    :key="'categorycarousel' + category.category.id + categoryIndex + category.videos.length"
                  >
                    <div
                      v-for="(item, index) in category.videos"
                      :key="item.id + '-' + index"
                      class="px-1"
                    >
                      <VideoItem :video="item" @play-video="viewVideo" />
                    </div>
                  </VueSlickCarousel>
                </client-only>
              </v-col>
            </template>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
    <v-dialog
      v-model="shareDialog"
      max-width="500"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t('Choose social media') }}</span>
          <v-btn class="mr-3 mt-sm-0 mt-2" @click="copyTextToClipboard(`${origin}/videos/${selectedVideo && selectedVideo.id}`)" outlined>{{ $t('Copy link to clipboard') }}</v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6" sm="4" class="d-flex justify-center">
                <ShareNetwork
                  network="facebook"
                  :url="`${origin}/videos/${selectedVideo && selectedVideo.id}`"
                  :title="selectedVideo && selectedVideo.title"
                >
                  <img src="~/static/facebook.png" width="80px" />
                </ShareNetwork>
              </v-col>
              <v-col cols="6" sm="4" class="d-flex justify-center">
                <ShareNetwork
                  network="WhatsApp"
                  :url="`${origin}/videos/${selectedVideo && selectedVideo.id}`"
                  :title="selectedVideo && selectedVideo.title"
                >
                  <img src="~/static/whatsapp.png" width="80px" />
                </ShareNetwork>
              </v-col>
              <v-col cols="6" sm="4" class="d-flex justify-center">
                <ShareNetwork
                  network="Email"
                  :url="`${origin}/videos/${selectedVideo && selectedVideo.id}`"
                  :title="selectedVideo && selectedVideo.title"
                >
                  <img src="~/static/email.png" width="80px" />
                </ShareNetwork>
              </v-col>
              <v-col cols="6" sm="4" class="d-flex justify-center d-sm-none">
                <ShareNetwork
                  network="SMS"
                  :url="`${origin}/videos/${selectedVideo && selectedVideo.id}`"
                  :title="selectedVideo && selectedVideo.title"
                >
                  <img src="~/static/sms.png" width="80px" />
                </ShareNetwork>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import VideoItem from "~/components/VideoItem";
// import Sidebar from "~/components/Sidebar";
// import RecommendedChannel from "~/components/RecommendedChannel";
// import Player from "~/components/Player";
import CopyToClipboard from "~/mixins/CopyToClipboard";

export default {
  name: "Landing",
  layout: 'DefaultLayout',
  mixins: [ CopyToClipboard ],
  components: {
    // VueSlickCarousel,
    VideoItem,
    // Player,
    // RecommendedChannel,
    // Sidebar
  },
  data: () => ({
    origin: null,
    categoryItems: [],
    recommendedChannels: [],
    popularVideos: [],
    recentVideos: [],
    topVideosCount: 5,
    categoryVideos: [],
    item: null,
    thumbnails: {
      0: {
        src: "https://i.ibb.co/vBkG1NR/2.png",
      },
      10: {
        src: "https://i.ibb.co/vBkG1NR/2.png",
      },
      20: {
        src: "https://i.ibb.co/vBkG1NR/2.png",
      },
      30: {
        src: "https://i.ibb.co/vBkG1NR/2.png",
      },
      40: {
        src: "https://i.ibb.co/vBkG1NR/2.png",
      },
    },
    selectedVideo: null,
    channelSlickSettings: {
      rtl: true,
      arrows: true,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      initialSlide: 0,
      rows: 2,
      responsive: [
        {
          breakpoint: 1263,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: "10%",
            arrows: false
          },
        },
        {
          breakpoint: 950,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: "50px",
            arrows: false
          },
        },
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: "20%",
            arrows: false
          },
        },
        {
          breakpoint: 650,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: true,
            centerPadding: "15%",
            arrows: false
          },
        },
        {
          breakpoint: 500,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            centerMode: false,
          },
        }
      ],
    },
    slickSettings: {
      rtl: true,
      arrows: true,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      initialSlide: 3,
      responsive: [
        {
          breakpoint: 1263,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            initialSlide: 2,
          },
        },
        {
          breakpoint: 959,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            initialSlide: 1,
          },
        },
        {
          breakpoint: 599,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 0,
          },
        },
      ],
    },
    popularSlickSettings: {
      rtl: true,
      // arrows: true,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
      initialSlide: 3,
      draggable: false,
      rows: 2,
      responsive: [
        {
          breakpoint: 1263,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            initialSlide: 2,
            arrows: true,
            rows: 1
          },
        },
        {
          breakpoint: 959,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            initialSlide: 1,
            arrows: true,
            rows: 1
          },
        },
        {
          breakpoint: 599,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 0,
            arrows: true,
            rows: 1
          },
        },
      ],
    },
    categoryViewItems: [],
    breakpoints: [
      {
        width: 1264,
        itemsPerRow: 4,
      },
      {
        width: 960,
        itemsPerRow: 3,
      },
      {
        width: 600,
        itemsPerRow: 2,
      },
      {
        width: 0,
        itemsPerRow: 1,
      },
    ],
    isMobile: true,
    computedPopularItems: [],
    recommendedVideoItems: [],
    categoryCarouselLoading: [],
    favorites: [],
    shareDialog: false
  }),
  computed: {
    ...mapGetters("auth", ["token", "user"])
  },
  methods: {
    ...mapActions("video", ["getRecommendedVideos", "getFavoriteVideoList"]),
    ...mapActions("channel", ["getRecommendedChannelList", "getChannelList"]),
    ...mapActions("category", ["getCategoryVideoList", "getCategoryList"]),
    viewVideo(video) {
      this.$router.push({ name: "Video", params: { id: video.id } });
    },
    playVideo(video) {
      this.selectedVideo = Object.assign({}, video);
      this.setRecommendedVideoItems();
    },
    resetHeight(playerHeight) {
      let count;
      if (process.browser) {
        if (window.innerWidth > 1400) {
          count = Math.floor(playerHeight / 95);
        } else if (window.innerWidth > 1100) {
          count = Math.floor(playerHeight / 85);
        } else {
          count = Math.floor(playerHeight / 85);
        }
        this.topVideosCount = count;
        this.setRecommendedVideoItems();
      }
    },
    setRecommendedVideoItems() {
      if (this.popularVideos.length > 0 && this.popularVideos[0].id == null) {
        return;
      }
      let items = this.popularVideos.slice(0, this.topVideosCount);
      // if (this.recommendedVideoItems.length == 0) {
      //   items = this.popularVideos.slice(0, this.topVideosCount);
      // }
      let index = -1;
      for (let i = 0; i < items.length; i++) {
        if (items[i].id == this.selectedVideo.id) {
          index = i;
          break;
        }
      }
      if (index > -1) {
        items.splice(index, 1);
        items.push(this.popularVideos[this.topVideosCount]);
      }
      this.recommendedVideoItems = Object.assign([], items);
    },
    countPopularItem() {
      let itemCount = 0;
      for (let i = 0; i < this.breakpoints.length; i++) {
        if (process.browser) {
          if (
            window.innerWidth > this.breakpoints[i].width &&
            itemCount < this.breakpoints[i].itemsPerRow
          ) {
            itemCount = this.breakpoints[i].itemsPerRow;
          }
        }
      }
      return itemCount;
    },
    resizeHandler() {
      let itemCount = this.countPopularItem();
      console.log(itemCount)
      if (itemCount == 4) {
        this.computedPopularItems = this.popularVideos.slice(this.topVideosCount + 1, this.topVideosCount + 9);
      } else if (itemCount == 3) {
        this.computedPopularItems = this.popularVideos.slice(this.topVideosCount + 1, this.popularVideos.length);
      } else {
        this.computedPopularItems = Object.assign([], this.popularVideos);
      }
    },
    goToCategory(categoryId) {
      this.$router.push({ name: "Category", params: { id: categoryId } });
    },
    slickCarouselChanged(slideIndex, categoryId) {
      if (slideIndex == 0) {
        let index;
        for (let i = 0; i < this.categoryVideos.length; i++) {
          if (this.categoryVideos[i].category.id == categoryId) {
            index = i;
            break;
          }
        }
        let payload = {
          categoryId: categoryId,
          limit: 6,
          offset: this.categoryVideos[index].videos.length,
        };
        this.getCategoryVideoList(payload).then((response) => {
          this.categoryVideos[index].videos = [
            ...this.categoryVideos[index].videos,
            ...response.videos,
          ];
          this.$nextTick(() => {
            this.$refs["categorycarousel" + categoryId][0].goTo(6);
          });
        });
      }
    }
  },
  destroyed() {
    if (process.browser) {
      window.removeEventListener("resize", this.resizeHandler);
    }
  },
  created() {
    if (process.browser) {
      this.origin = window.location.origin;
    }
    // this.resizeHandler();
    let itemCount = this.countPopularItem();
    let tempVideo = {
      title: null,
      channel: null,
      views: null,
      publish_time: null,
      id: null
    }
    this.computedPopularItems = new Array(itemCount * 2).fill(tempVideo);
    this.favorites = new Array(itemCount).fill(tempVideo);
    let tempCategory = {
      created_at: null,
      hidden: false,
      id: null,
      image: "",
      name: null,
      order: null,
      updated_at: null
    };
    for (let i = 0; i < 4; i ++) {
      this.categoryVideos.push({
        category: tempCategory,
        videos: new Array(itemCount).fill(tempVideo)
      })
    }
    if (process.browser) {
      this.isMobile = window.innerWidth < 600 ? true : false;
      window.addEventListener("resize", this.resizeHandler);
    }
  },
  async fetch() {
    var data = await this.getFavoriteVideoList();
    this.favorites = Object.assign([], data.videos);
    data = await this.getCategoryList();
    this.categoryItems = Object.assign([], data.categories);

    this.getRecommendedVideos({ limit: 12 + this.topVideosCount }).then(
      (res) => {
        this.popularVideos = Object.assign([], res.videos);
        // this.resizeHandler();
        this.computedPopularItems = Object.assign([], this.popularVideos);
        this.selectedVideo = Object.assign({}, this.popularVideos[0]);
        this.setRecommendedVideoItems();
      }
    );

    this.getRecommendedChannelList().then((res) => {
      this.recommendedChannels = Object.assign([], res.channels);
    });

    return Promise.all(this.categoryItems.slice(0, 99).map(category => {
      let payload = {
        categoryId: category.id,
        limit: 6,
        offset: 0,
      };
      return this.getCategoryVideoList(payload).then((response) => {
        return {
          videos: response.videos,
          category: category
        }
      });
    })).then(tmpCategoryVideos => {
      tmpCategoryVideos = tmpCategoryVideos.sort(function(a,b) {
        if (!a.category.order) {
          return 1;
        }
        if (a.category.order > b.category.order) return 1;
        else if (a.category.order == b.category.order) {
          if (a.category.id > b.category.id) {
            return 1;
          } else {
            return -1;
          }
        }
        else return -1;
      });
      this.categoryVideos = Object.assign([], tmpCategoryVideos);
    });
  },
  mounted() {
    this.resizeHandler();
  },
};
</script>

<style scoped lang="scss">
.video-info {
  .subtitle-2 {
    color: #5a5a5a;
  }
}

.slick-slider {
  margin-left: -12px;
  margin-right: -12px;
}

::v-deep .video-list .v-list-item {
  align-items: unset;
  margin-bottom: 15px;
}

::v-deep .video-list .v-list-item .v-list-item__content {
  align-self: unset;
  padding: 0;
}

::v-deep .video-list .v-list-item {
  .v-list-item__title {
    min-height: 32px;
    white-space: unset;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
  }

  .v-list-item__subtitle {
    color: #5a5a5a;
  }
}

::v-deep .video-list .v-list-item .v-list-item__action {
  min-height: 80px;
  margin-left: 20px;
  margin-bottom: 0;
  font-size: 12px;

  img {
    max-width: 180px !important;
  }
}

.recommended-channels {
  background: #222428;
}

::v-deep .v-slide-group__next {
  position: absolute;
  left: 0;
  top: 8px;
  height: 200px;
  background-image: linear-gradient(to right, black, rgba(0, 0, 0, 0));

  &--disabled {
    background-image: none;
  }

  i {
    color: white;
    font-size: 72px;
  }
}

::v-deep .v-slide-group__prev {
  position: absolute;
  right: 0;
  top: 8px;
  height: 200px;
  background-image: linear-gradient(to left, black, rgba(0, 0, 0, 0));
  z-index: 1;

  &--disabled {
    background-image: none;
  }

  i {
    color: white;
    font-size: 72px;
  }
}

::v-deep .recommended-channels .slick-arrow {
  background-color: transparent;
}

.recommended-channels {
  position: relative;
}


::v-deep .slick-disabled {
  display: none !important;
}

::v-deep .slick-prev {
  z-index: 11;
  display: block;
  width: 40px;
  left: 8px;
  top: calc(((100% - 98px) / 2) + 4px);
  height: calc(100% - 98px);
  background-color: rgba(0, 0, 0, 0.8);

  &::before {
    content: "\F0141";
    font: normal normal normal 24px/1 "Material Design Icons";
  }
}

::v-deep .slick-next {
  z-index: 11;
  display: block;
  width: 40px;
  right: 4px;
  top: calc(((100% - 98px) / 2) + 4px);
  height: calc(100% - 98px);
  background-color: rgba(0, 0, 0, 0.8);
  &::before {
    content: "\F0142";
    font: normal normal normal 24px/1 "Material Design Icons";
  }
}

@media (max-width: 1400px) {
  ::v-deep .video-list .v-list-item {
    margin-bottom: 5px;
    .v-list-item__action {
      .v-image {
        max-width: 140px !important;
        width: 140px !important;
        min-width: 140px !important;
      }
    }
  }
}

@media (max-width: 1263px) {
  .recommended-channels:before {
    content: " ";
    width: 50px;
    height: 100%;
    position: absolute;
    left: 0;
    background: linear-gradient(90deg, black, transparent);
    z-index: 10;
  }

  .recommended-channels:after {
    content: " ";
    width: 50px;
    height: 100%;
    position: absolute;
    right: 0;
    background: linear-gradient(270deg, black, transparent);
    z-index: 10;
  }
}

</style>
