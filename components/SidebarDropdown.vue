<template>
  <v-navigation-drawer
    v-model="dropDownShow"
    fixed
    class="mt-14"
    :class="{'pt-15': showbanner}"
    width="100%"
    height="100vh"
    overlay-opacity="0"
    :right="true"
  >
    <v-list-item-group color="primary" v-if="!token">
      <v-list-item>
        <v-list-item-content class="py-2">
          <v-list-item-title class="font-weight-bold">
            <a href="/auth/login" @click="toggleDropdownMenu" class="black--text">{{
              $t("Login")
            }}</a>
            <span class="mx-4">&#183;</span>
            <a href="/auth/signup" @click="toggleDropdownMenu" class="black--text">{{
              $t("Register")
            }}</a>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
    <v-list-item-group color="primary" v-else>
      <v-list-item>
        <v-list-item-content class="py-2">
          <v-list-item-title class="font-weight-bold">
            <span @click="logout" aria-controls>{{ $t("Log out") }}</span>
            <span class="mx-4">|</span>
            <span>{{ user && user.name }}</span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>

    <v-divider></v-divider>

    <v-subheader>{{ $t("Channels") }}</v-subheader>
    <v-list-item-group color="primary">
      <v-list-item
        @click="goToChannel(item)"
        v-for="(item, i) in channels"
        :key="i"
      >
        <v-list-item-avatar color="grey" size="30" class="my-0">
          <v-img :src="item.image"></v-img>
        </v-list-item-avatar>
        <v-list-item-content class="py-2">
          <v-list-item-title v-text="item.name"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
    <v-btn text class="font-weight-bold" @click="showAllChannels">{{ $t("All channels") }}</v-btn>

    <v-divider></v-divider>

    <v-subheader>{{ $t("Topics") }}</v-subheader>
    <v-list-item-group color="primary">
      <v-list-item
        v-for="(item, i) in categories"
        :key="i"
        @click="goToCategory(item)"
      >
        <v-list-item-content class="py-2">
          <v-list-item-title v-text="item.name"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-navigation-drawer>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "SidebarDropdown",
  computed: {
    ...mapState(["showbanner"]),
    ...mapGetters(["showDropdownMenu"]),
    ...mapGetters("auth", ["token", "user"]),
    ...mapGetters("channel", ["channels"]),
    ...mapGetters("category", ["categories"]),
    dropDownShow: {
      get() {
        return this.showDropdownMenu;
      },
      set(val) {
        this.setDropdownMenu(val);
      }
    }
  },
  methods: {
    ...mapActions("channel", ["getChannelList"]),
    ...mapActions("category", ["getCategoryList"]),
    ...mapActions(["toggleDropdownMenu", "setDropdownMenu"]),
    showAllChannels() {
      this.$router.push('/channels');
      this.toggleDropdownMenu();
    }, 
    goToChannel(item) {
      this.$router.push({ name: 'Channel', params: { id: item.id } });
      this.toggleDropdownMenu();
    },
    goToCategory(item) {
      this.$router.push({ name: 'Category', params: { id: item.id } });
      this.toggleDropdownMenu();
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = "/";
    }
  }
};
</script>

<style scoped lang="scss">
 .v-navigation-drawer {
  z-index: 13;
}

.sidemenu-inactive {
  width: 0;
  height: 0;
  overflow: hidden;
  position: fixed;
}

.sidemenu-active {
  width: 100%;
  height: fit-content;
  transition: width .5s;
  position: fixed;
  background: #f6f6f6;
  z-index: 10;
  overflow-y: auto;
}

::v-deep .v-navigation-drawer__content {
  margin-bottom: 56px;
  height: unset;
  z-index: 12;
}

::v-deep .v-list-item .v-list-item__title {
  font-size: 14px;
}

::v-deep .v-list-item {
  min-height: 36px;
}

::v-deep .v-subheader {
  height: 36px;
}
</style>
