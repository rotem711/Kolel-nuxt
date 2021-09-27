<template>
  <v-app id="auth">
    <AppBanner />
    <div class="auth-banner" :class="showbanner ? 'mt-15' : ''">
    </div>
    <div class="mx-auto">
      <router-link to="/">
        <img src="~/static/logo.png" width="150px" />
      </router-link>
    </div>
    <router-view />
    <div class="footer white mt-10 py-10">
      <div class="d-flex justify-center mb-6">
        <router-link to="/" class="mx-4 black--text">{{ $t('Home page') }}</router-link>
        <router-link to="/tos" class="mx-4 black--text">{{ $t('Privacy Terms of Use') }}</router-link>
        <a href="mailto:hello@kolel.org" target="_blank" class="mx-4 black--text">{{ $t('Contact Us') }}</a>
      </div>
      <div class="d-flex justify-center store-link-icons">
        <a href="https://apps.apple.com/us/app/kolel-judaism-torah-videos/id1497982129" target="_blank" class="ml-4"><img src="~/static/app_store.png" width="160px" /></a>
        <a href="https://play.google.com/store/apps/details?id=org.kolel&hl=en&gl=US" target="_blank"><img src="~/static/google_play.jpg" width="160px" /></a>
      </div>
    </div>
    <v-dialog v-model="dialog" width="500">
      <!-- <template v-slot:activator="{ on, attrs }">
        <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
          Click Me
        </v-btn>
      </template> -->

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          הרישום בקרוב!
        </v-card-title>

        <v-card-text>
           כרגע אנחנו עמלים על להוסיף התחברות לאתר. מבטיחים שזה יהיה בקרוב. בנתיים תוכלו להנות  מחוויה אישית באפליקציות מובייל שלנו!
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false"> סגור </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
  import AppBanner from "@/components/AppBanner";
  import { mapState, mapActions, mapGetters } from "vuex";
  export default {
    name: 'AuthLayout',
    components: {
      AppBanner
    },
    data() {
      return {
        dialog: false,
      };
    },
    computed: {
      ...mapState(["showbanner"]),
    },
  }
</script>

<style lang="scss">
#auth {
  background: #f6f6f6;
}

.auth-banner {
  background-image: url('~/static/wall.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  height: 100px;
  width: 100%;
}

.footer {
  width: 100%;
}
</style>