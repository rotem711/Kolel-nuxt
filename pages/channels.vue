<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="2">
        <Sidebar />
      </v-col>
      <v-col cols="12" md="10">
        <v-container fluid>
          <v-row class="white">
            <v-col cols="12">
              <h2 class="heading-1">{{ $t("Recommended") }}</h2>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                  lg="4"
                  v-for="(item, index) in channelViewItems"
                  :key="'channel' + index"
                  class="channel-wrapper"
                >
                  <ChannelItem
                    :channel="item"
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" class="text-center" v-if="showLoadMoreButton">
              <span class="mr-4 subtitle-1 font-weight-bold" aria-controls @click="loadMoreChannels">{{ $t('Show more') }}</span>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Sidebar from "@/components/Sidebar";
import { mapActions } from "vuex";
import ChannelItem from "@/components/ChannelItem";

export default {
  name: "AllChannels",
  layout: "DefaultLayout",
  components: {
    Sidebar,
    ChannelItem
  },
  data: () => ({
    channelItems: [],
    isMobile: true,
    breakpoints: [{
      width: 1263,
      itemsPerRow: 3
    }, {
      width: 700,
      itemsPerRow: 2
    }],
    currentPage: 0,
    showLoadMoreButton: false
  }),
  computed: {
    channelViewItems() {
      let itemsToShow = this.calculateItemsPerRow() * this.currentPage * 10;
      return this.channelItems.slice(0, itemsToShow);
    }
  },
  methods: {
    ...mapActions("channel", ["getChannelList"]),
    calculateItemsPerRow() {
      let itemCount = 1; 
      for (let i = 0; i < this.breakpoints.length; i ++) {
        if (process.browser) {
          if (window.innerWidth > this.breakpoints[i].width && itemCount < this.breakpoints[i].itemsPerRow) {
            itemCount = this.breakpoints[i].itemsPerRow;
          }
        }
      }
      return itemCount;
    },
    async initialize() {
      return this.loadMoreChannels();
    },
    loadMoreChannels() {
      let itemCount;

      if (process.browser) {
        itemCount = this.calculateItemsPerRow();
      } else {
        itemCount = 3;
      }

      let limit = itemCount * 10 * (this.currentPage + 1) - this.channelItems.length;
      if (limit <= 0) {
        return;
      }

      let payload = {
        limit: limit,
        offset: this.channelItems.length,
        sort_by: 'title',
        sort_dir: 'asc'
      }

      return this.getChannelList(payload).then(res => {
        this.channelItems = [...this.channelItems, ...res.channels];
        this.currentPage ++;
        this.showLoadMoreButton = res.total > this.channelItems.length;
      })
    }
  },
  created() {
    if (process.browser) {
      this.isMobile = window.innerWidth < 600 ? true : false;
    }
  },
  async fetch() {
    await this.initialize();
  },
};
</script>

<style scoped lang="scss">
::v-deep .v-list-item__subtitle {
  color: #5a5a5a!important;
}

.channel-wrapper {
  @media (max-width: 959px) {
    max-width: 50%;
  }

  @media (max-width: 700px) {
    max-width: 100%;
  }
}
</style>
