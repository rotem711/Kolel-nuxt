<template>
	<div class="vjs-custom-skin" ref="videoPlayerWrapper">
    <video
      class="video-js vjs-theme-city vjs-fluid vjs-16-9"
      ref="videoPlayer"
      :options="playerOptions"      
      controls
      playsinline
      fluid
      aspectRatio="16:9"
    ></video>
  </div>
</template>

<script>
import videojs from 'video.js';
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Player",
  props: {
    thumb_url: null,
    videoUrl: null,
    thumbnails: Object,
    autoplayitem: {
      type: Boolean,
      default: false
    },
    video: Object
  },
  data: () => ({
    playerOptions: {
      preload: 'none',
      playbackRates: [0.5, 0.8, 1, 1.5, 2],
      poster: ""
    },
    player: null,
    watchInterval: null
  }),
  watch: {
    "videoUrl": function(val) {
      this.playVideo(val);
    }
  },
  computed: {
    ...mapGetters("auth", ["user"])
  },
  methods: {
    ...mapActions("video", ["markWatch"]),
    playVideo (source) {
      this.player.reset() // in IE11 (mode IE10) direct usage of src() when <src> is already set, generated errors,
      this.player.src(source)
      this.player.poster(this.thumb_url)
      // this.thumbnails(this.thumbnails);
      if (this.autoplayitem) {
        this.player.play()
      } 
      // this.player.thumbnails(this.thumbnails);
      // this.player.load()
    },
    playerReadied(player) {
      // console.log('player readied')
      // this.player.play()
      // this.player.thumbnails(this.thumbnails);
    },
    playerRateChanged(event) {
      // console.log('rate changed')
    },
    windowResizeEventHandler(e) {
      this.$emit('reset-height', this.$refs.videoPlayerWrapper.clientHeight);
    },
    playing(e) {
      this.watchInterval = setInterval(() => {
        let payload = {
          id: this.video.id,
          position: Math.ceil(this.player.currentTime())
        }
        this.markWatch(payload);
      }, 5000)
    },
    stopInterval(e) {
      clearInterval(this.watchInterval);
    }
  },
  mounted () {
    this.$emit('reset-height', this.$refs.videoPlayerWrapper.clientHeight);
    this.player = videojs(this.$refs.videoPlayer, this.playerOptions, function onPlayerReady() {
      this.reset() // in IE11 (mode IE10) direct usage of src() when <src> is already set, generated errors,
      this.src(this.videoUrl)
      this.poster(this.thumb_url)
      // this.thumbnails(this.thumbnails);
      if (this.autoplayitem) {
        this.play()
      } 
    })

    this.playVideo(this.videoUrl);

    this.player.on('ratechange', this.playerRateChanged);
    this.player.on('play', this.playing);
    this.player.on('pause', this.stopInterval);
    this.player.on('ended', this.stopInterval);
  },
  created() {
    if (process.browser) {
      window.addEventListener("resize", this.windowResizeEventHandler);
    }
  },
  destroyed() {
    if (process.browser) {
      window.removeEventListener("resize", this.windowResizeEventHandler);
    }
  },
};
</script>

<style scoped>
  .player {
    position: absolute !important;
    width: 100%;
    height: 60%;
  }

  .vjs-custom-skin {
    /* height: 100%; */
  }

  .vjs-custom-skin /deep/ .video-js {
    width: 100%;
    /* height: 100%; */
    /* min-height: 300px; */
  }
</style>
