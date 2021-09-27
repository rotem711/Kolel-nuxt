<template>
  <v-container class="pt-0">
    <v-row>
      <v-col cols="12" class="position-relative py-10">
        <div class="black black-background"></div>
        <Player
          :videoUrl="currentVideoItem ? currentVideoItem.video_url : null"
          :thumbnails="thumbnails"
          :thumb_url="currentVideoItem ? currentVideoItem.thumb_url : null"
          @reset-height="resetHeight"
          :autoplayitem="true"
          :video="currentVideoItem"
        />
      </v-col>
    </v-row>
    <v-row class="">
      <v-col cols="12" class="d-flex flex-column align-baseline border-bottom">
        <div>
          <h2>{{ currentVideoItem && currentVideoItem.title }}</h2>
        </div>
        <div class="mt-auto video-info">
          <p class="my-0">{{ currentVideoItem && currentVideoItem.views | formatViews }} {{ $t('views') }} <span class="mx-0">&#183;</span> {{ currentVideoItem && currentVideoItem.publish_time | fromNow }}</p>
          <v-btn :disabled="!currentVideoItem || !currentVideoItem.id" @click="shareDialog = true" outlined><v-icon class="ml-2" text>mdi-cloud-upload-outline</v-icon>{{ $t("Sharing") }}</v-btn>
        </div>
      </v-col>
      <v-col cols="12" class="d-flex justify-space-between border-bottom align-center">
        <div class="d-flex align-center">
          <v-avatar color="grey" size="80px" class="ml-4">
            <v-img :src="currentVideoItem && currentVideoItem.channel.image"></v-img>
          </v-avatar>
          <span class="title font-weight-bold">{{ currentVideoItem && currentVideoItem.channel.name }}</span>
        </div>
        <v-btn class="subtitle-1 red headline white--text my-2 px-6 text-center" @click="follow">{{ $t('Follow') }}</v-btn>
      </v-col>
    </v-row>
    <v-row class="white">
      <v-col
        cols="12"
        md="6"
        v-for="(item, index) in videoItems"
        :key="index"
      >
        <div
          aria-controls
          class="d-flex video-item"
        >
          <div class="mt-0 ml-2" @click="$router.push({ name: 'Video', params: { id: item.id }})">
            <div v-if="item.thumb_url">
              <img class="video-item--image" :src="item.thumb_url" />
            </div>
          </div>

          <div class="d-flex flex-column justify-space-between pl-4">
            <h3 @click="playVideo(item)" class="video-title">
              {{ item.title }}
            </h3>
            <p @click="$router.push({ name: 'Channel', params: { id: item.channel.id } })" class="mb-0 video-detail">
              <span>{{ item.channel.name }} </span> <br />
              {{ item.views | formatViews }} {{ $t('views') }} <span class="mx-0">&#183;</span> {{ item.publish_time | fromNow }}
            </p>
          </div>
        </div>
      </v-col>
    </v-row>
    <v-dialog
      v-model="shareDialog"
      max-width="500"
    >
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t('Choose social media') }}</span>
          <v-btn class="mr-3 mt-sm-0 mt-2" @click="copyTextToClipboard(`${window.location.origin}/videos/${currentVideoItem && currentVideoItem.id}`)" outlined>{{ $t('Copy link to clipboard') }}</v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="6" sm="4" class="d-flex justify-center">
                <ShareNetwork
                  network="facebook"
                  :url="`${window.location.origin}/videos/${currentVideoItem && currentVideoItem.id}`"
                  :title="currentVideoItem && currentVideoItem.title"
                >
                  <v-img src="~/static/facebook.png" width="80px" />
                </ShareNetwork>
              </v-col>
              <v-col cols="6" sm="4" class="d-flex justify-center">
                <ShareNetwork
                  network="WhatsApp"
                  :url="`${window.location.origin}/videos/${currentVideoItem && currentVideoItem.id}`"
                  :title="currentVideoItem && currentVideoItem.title"
                >
                  <v-img src="~/static/whatsapp.png" width="80px" />
                </ShareNetwork>
              </v-col>
              <v-col cols="6" sm="4" class="d-flex justify-center">
                <ShareNetwork
                  network="Email"
                  :url="`${window.location.origin}/videos/${currentVideoItem && currentVideoItem.id}`"
                  :title="currentVideoItem && currentVideoItem.title"
                >
                  <v-img src="~/static/email.png" width="80px" />
                </ShareNetwork>
              </v-col>
              <v-col cols="6" sm="4" class="d-flex justify-center d-sm-none">
                <ShareNetwork
                  network="SMS"
                  :url="`${window.location.origin}/videos/${currentVideoItem && currentVideoItem.id}`"
                  :title="currentVideoItem && currentVideoItem.title"
                >
                  <v-img src="~/static/sms.png" width="80px" />
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
import Player from "@/components/Player";
import { mapActions } from "vuex";
import CopyToClipboard from "~/mixins/CopyToClipboard";

export default {
  name: "Video",
  mixins: [ CopyToClipboard ],
  components: {
    Player,
  },
  data: () => ({
    currentVideoItem: null,
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
    videoItems: [],
    isMobile: true,
    shareDialog: false,
    window: window
  }),
  watch: {
    "$route.params": {
      handler: function(val) {
        this.initialize();
      },
      deep: true
    }
  },
  methods: {
    ...mapActions("video", ["getRecommendedVideos", "getRecentVideoList", "getVideoDetail"]),
    ...mapActions("channel", ["getRecommendedChannelList", "getChannelList", "getChannelVideoList", "followChannel"]),
    ...mapActions("category", ["getCategoryVideoList"]),
    resetHeight(playerHeight) {
      let count;
      if (window.innerWidth > 1400) {
        count = Math.floor(playerHeight / 105);
      } else if (window.innerWidth > 1100) {
        count = Math.floor(playerHeight / 95);
      } else {
        count = Math.floor(playerHeight / 85);
      }
      this.recentVideoCount = count;
    },
    async initialize() {
      let res = await this.getVideoDetail(this.$route.params.id);
      this.currentVideoItem = Object.assign({}, res.video);

      let payload = {
        channelId: this.currentVideoItem.channel_id
      }

      this.getChannelVideoList(payload).then(res => {
        this.videoItems = res.videos;
        this.videoItems = this.videoItems.map(item => ({
          ...item,
          channel: this.currentVideoItem.channel
        }))
      })
    },
    follow() {
      let payload = {
        channelId: this.currentVideoItem.channel_id,
        follow: true
      }

      this.followChannel(payload).then(res => {
        console.log(res);
      })
    }
  },
  created() {
    this.isMobile = window.innerWidth < 600 ? true : false;
  },
  async mounted() {
    this.initialize();
  },
};
</script>

<style scoped lang="scss">
.video-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 50px;
  width: 100%;
}

.black-background {
  width: 100vw;
  height: 100%;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
}

.video-item {
  .video-title {
    white-space: unset;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .video-item--image {
    max-width: 300px;

    @media (max-width: 1264px) {
      max-width: 200px;
    }
  }
}

.video-info, .video-detail {
  color: #5a5a5a!important;
}
</style>
