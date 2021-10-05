<template>
  <v-container fluid class="pt-0">
    <v-row>
      <v-col cols="12" v-if="searchResultLoaded">
        <h2 v-if="videoItems.length > 0">{{ $t("Search Results") }}: "{{ keyword }}"</h2>
        <h2 v-else>{{ $t("No search results found for") }} "{{ keyword }}"</h2>
      </v-col>
      <v-col cols="12">
        <div
          aria-controls
          class="d-flex flex-column flex-sm-row video-item mb-5"
          v-for="(item, index) in videoItems"
          :key="index"
        >
          <div
            class="mt-0 ml-2"
            @click="goToVideoPage(item.id)"
          >
            <div v-if="item.thumb_url">
              <img class="video-item--image" :src="item.thumb_url" />
            </div>
          </div>

          <div class="d-flex flex-column justify-space-between pl-4">
            <h3 @click="playVideo(item)" class="video-title">
              {{ item.title }}
            </h3>
            <p
              @click="goToChannelPage(item.channel.id)"
              class="mb-0 video-detail"
            >
              <span>{{ item.channel.name }} </span> <br />
              {{ item.views | formatViews }} {{ $t("views") }}
              <span class="mx-0">&#183;</span> {{ item.publish_time | fromNow }}
            </p>
          </div>
        </div>
        <div class="w-100 py-5" v-observe-visibility="visibilityChanged"></div>
        <div class="w-100 d-flex">
          <v-progress-circular
            indeterminate
            color="black"
            v-if="loading"
            class="mx-auto"
          ></v-progress-circular> 
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
import RedirectMixin from "~/mixins/RedirectMixin";

export default {
  name: "SearchResult",
  layout: "DefaultLayout",
  mixins: [ RedirectMixin ],
  data: () => ({
    videoItems: [],
    keyword: null,
    searchResultLoaded: false,
    total: 0,
    pageSize: 7,
    loading: false
  }),
  watch: {
    "$route.query.keyword": {
      handler: function (val) {
        this.initialize();
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions("video", [
      "getRecommendedVideos",
      "getRecentVideoList",
      "searchVideos",
    ]),
    async initialize() {
      this.videoItems = [];
      this.total = 0;
      this.searchResultLoaded = false;
      this.search();
    },
    async search() {
      this.loading = true;
      this.keyword = this.$route.query.keyword;
      let payload = {
        term: this.keyword,
        limit: this.pageSize,
        offset: this.videoItems.length
      }
      this.searchVideos(payload).then((res) => {
        this.searchResultLoaded = true;
        this.videoItems = [...this.videoItems, ...res.videos];
        this.total = res.total;
        if (this.total == 0) {
          this.getPopularVideos();
        }
        setTimeout(() => {
          this.loading = false;
        }, 500);
      });
    },
    getPopularVideos() {
      this.getRecommendedVideos({ limit: 3 }).then(
        (res) => {
          this.videoItems = Object.assign([], res.videos);
        }
      );
    },
    visibilityChanged(isVisible, entry) {
      if (this.total > 0 && this.total > this.videoItems.length && isVisible) {
        if (!this.loading) {
          this.search();
        }
      }
    }
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
    width: 400px;

    @media (max-width: 1264px) {
      width: 300px;
    }
  }
}

.video-info,
.video-detail {
  color: #5a5a5a !important;
}
</style>
