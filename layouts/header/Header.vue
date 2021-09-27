<template>
  <v-app-bar app clipped-left clipped-right color="white" light style="z-index: 14;" :style="showbanner ? 'transform: translateY(60px);' : ''">
    <v-btn
      color="white"
      dark
      small
      fab
      class="black--text menu-toggle d-block d-md-none elevation-0"
      @click="showNavDropdown"
    >
      <v-icon>mdi-menu</v-icon>
    </v-btn>
    <v-spacer class="d-block d-md-none"/>
    <!--- Logo -->
    <a href="/" class="d-flex">
      <img src="~/static/logo.png" width="50px" height="50px"/>
    </a>
    <!--- Logo -->
    <v-spacer/>
    <div class="search-box mt-1 d-md-block d-none">      
      <v-text-field
        color="white"
        v-model="searchKeyword"
        append-icon="mdi-magnify"
        @click:append="search"
        v-on:keyup="searchKeydown"
        class="mx-4"
        flat
        hide-no-data
        hide-details
        :label="$t('Search')"
        solo-inverted
      ></v-text-field>
    </div>
    <v-btn
      color="white"
      dark
      small
      fab
      class="black--text menu-toggle d-block d-md-none elevation-0"
      @click="showSearchbox"
      v-if="!showSearch"
    >
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <v-btn
      color="white"
      dark
      small
      fab
      class="black--text menu-toggle d-block d-md-none elevation-0"
      @click="hideSearchbox"
      v-else
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-spacer class="d-md-block d-none"/>
    <div class="d-md-block d-none" v-if="!user">
      <nuxt-link to="/auth/login" class="grey--text">
        {{ $t("Login") }}
      </nuxt-link>
      <span class="mx-4">&#183;</span>
      <nuxt-link to="/auth/signup" class="grey--text">
        {{ $t("Register") }}
      </nuxt-link>
    </div>
    <div class="d-md-block d-none" v-else>
      <span @click="logout" aria-controls>{{ $t("Log out") }}</span>
      <span class="mx-4">|</span>
      <span>{{ user && user.name }}</span>
    </div>
  </v-app-bar>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "Header",

  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    loading: false,
    items: [],
    searchKeyword: null,
    showLogo: true,

    href() {
      return undefined;
    },
  }),

  watch: {
    "$route": {
      handler: function (val) {
        this.setSearchKeyword();
      },
      deep: true,
    },
  },

  computed: {
    ...mapState(["Sidebar_drawer", "showSearch", "showbanner"]),
    ...mapGetters("auth", ["token", "user"])
  },

  methods: {
    ...mapActions("video", ["searchVideos"]),
    ...mapActions(["toggleDropdownMenu", "setSearchbox"]),
    showNavDropdown() {
      this.toggleDropdownMenu();
    },
    showSearchbox() {
      this.setSearchbox(true);
    },
    hideSearchbox() {
      this.setSearchbox(false);
    },
    search() {
      this.$router.push('/searchresult?keyword=' + this.searchKeyword);
    },
    searchKeydown(e) {
      if (e.keyCode === 13) {
        this.$router.push('/searchresult?keyword=' + this.searchKeyword);
      }
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = "/";
    },
    setSearchKeyword() {
      if (this.$route.name == "SearchResult") {
        this.searchKeyword = this.$route.query.keyword;
      }
    }
  },

  mounted() {
    this.setSearchKeyword();
  },
};
</script>

<style lang="scss" scoped>
.hidelogo {
  display: none;
}

.searchinput {
  position: absolute;
  width: 100%;
  margin: 0;
  left: 0;
  z-index: 10;
  padding: 0 15px;
}

.descpart {
  max-width: 220px;
}

.search-box {
  width: 40%;
  flex: 1;
}
</style>
