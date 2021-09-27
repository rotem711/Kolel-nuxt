<template>
  <v-card class="pa-1 video-item mx-auto" :width="width" aria-controls>
    <v-img
      class="white--text align-end"
      :src="video.thumb_url"
      @click="playVideo"
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

    <v-card-text class="text--primary pt-0 pb-1 px-1">
      <v-list two-line class="transparent pa-0">
        <v-list-item class="pa-0">
          <v-list-item-avatar
            color="grey"
            @click="viewChannel"
            v-if="video.channel"
          >
            <v-img :src="video.channel.image"></v-img>
          </v-list-item-avatar>
          <v-list-item-content class="py-2">
            <v-list-item-title
              v-text="video.title"
              class="mb-2"
              @click="playVideo"
            ></v-list-item-title>
            <v-list-item-subtitle @click="viewChannel" v-if="video.id">
              <span v-if="video.channel">{{ video.channel.name }} </span> <br />
              {{ video.views | formatViews }} {{ $t('views') }} <span class="mx-0">&#183;</span> {{ video.publish_time | fromNow }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "VideoItem",
  props: {
    video: Object,
    width: String
  },
  methods: {
    playVideo() {
      this.$emit("play-video", this.video);
    },

    viewChannel() {
      this.$router.push({
        name: "Channel",
        params: { id: this.video.channel_id },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.video-item {
  box-shadow: none !important;
  direction: rtl;
}

::v-deep .v-list-item .v-list-item__title {
  // min-height: 34px;
  white-space: unset;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
}

::v-deep .v-list-item .v-list-item__content {
  min-height: 84px;
}

::v-deep .v-list-item .v-list-item__subtitle {
  font-size: 12px;
  color: #5a5a5a;
}

::v-deep .v-list-item .v-list-item__avatar {
  align-self: baseline;
  margin-top: 8px!important;
  margin-left: 8px!important;
}
</style>
