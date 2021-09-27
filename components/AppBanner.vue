<template>
  <v-container class="d-block d-sm-none py-0 white app-banner" v-if="showbanner">
    <v-row>
      <v-col cols="12" class="pa-0">
        <v-list-item>
          <v-list-item-avatar class="ma-0">
            <img src="~/static/logo.png" width="50px" height="50px"/>
          </v-list-item-avatar>

          <v-list-item-content class="pa-0 px-3">
            <v-list-item-title class="font-weight-bold" v-text="$t('including')"></v-list-item-title>
            <v-list-item-subtitle v-text="$t('Open in the Kolel app')"></v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-action class="pa-0 d-flex flex-row">
            <v-btn rounded @click="open">
              Open
            </v-btn>
            <v-btn icon @click="closeBanner">
              <v-icon
                class="black--text"
                size="30"
              >mdi-close</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "AppBanner",
  computed: {
    ...mapState(["showbanner"]),
  },
  data() {
    return {
      expiredTime: 3600 * 6,
      interval: null
    }
  },
  methods: {
    ...mapActions(["showBanner"]),
    closeBanner() {
      this.showBanner(false);
      if (process.browser) {
        localStorage.setItem('hidebanner', true);
      }
      clearInterval(this.interval);
      this.startCountExpiredTime();
    },
    openBanner() {
      this.showBanner(true);
      if (process.browser) {
        localStorage.removeItem('hidebanner');
      }
      clearInterval(this.interval);
    },
    open() {
      if (this.$route.name == 'Video') {
        if (process.browser) {
          window.location.href = "kolel://video/" + this.$route.params.id;
        }
      } else if (this.$route.name == 'Channel') {
        if (process.browser) {
          window.location.href = "kolel://channel/" + this.$route.params.id;
        }
      } else {
        var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        var now = new Date().valueOf();
        setTimeout(function () {
            if (new Date().valueOf() - now > 100) return;
            if (iOS) {
              if (process.browser) {
                window.location = "https://apps.apple.com/us/app/kolel-judaism-torah-videos/id1497982129";
              }
            } else {
              if (process.browser) {
                window.location = "https://play.google.com/store/apps/details?id=org.kolel&hl=en&gl=US";
              }
            }
        }, 25);
        if (process.browser) {
          window.location = "kolel://";
        }
      }
    },
    startCountExpiredTime() {
      this.interval = setInterval(() => {
        if (this.expiredTime <= 0) {
          clearInterval(this.interval);
          this.openBanner();
        }
        this.expiredTime --;
        if (process.browser) {
          localStorage.setItem('bannerExpiredTime', this.expiredTime);
        }
      }, 1000);
    }
  },
  mounted() {
    if (process.browser) {
      var bannerExpiredTime = localStorage.getItem('bannerExpiredTime');
    }
    if (bannerExpiredTime) {
      this.expiredTime = bannerExpiredTime;
    } else {
      if (process.browser) {
        localStorage.setItem('bannerExpiredTime', this.expiredTime);
      }
    }
    if (this.$vuetify.breakpoint.name == 'xs' && !this.showbanner) {
      this.startCountExpiredTime();
    }
  },
};
</script>

<style scoped lang="scss">
.app-banner {
  position: fixed;
  z-index: 20;
}
</style>
