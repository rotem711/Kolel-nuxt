<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="text-center">
          <img
            class="home-thumb"
            src="https://api.kolel.org/static/iPhone1-2d9b7d0083262620d68d4d295a05937fcb2fba7e4ecc28b0b2c09234dc54818f.png"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Store",
  layout: "DefaultLayout",
  data: () => ({}),

  methods: {},

  async mounted() {
    if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
      window.location.href =
        "https://play.google.com/store/apps/details?id=org.kolel";
    }
    if (navigator.userAgent.toLowerCase().indexOf("iphone") > -1) {
      window.location.href =
        "https://apps.apple.com/il/app/kolel-%D7%9B%D7%95%D7%9C%D7%9C/id1497982129";
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
