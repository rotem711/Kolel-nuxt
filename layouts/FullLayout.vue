<template>
  <v-app id="default">
    <AppBanner />
    <Header />
    <SidebarDropdown />
    <SearchBox />
    <div class="mt-16" :class="showbanner ? 'pt-15' : ''">
      <v-container fluid class="pt-0">
        <v-row>
          <v-col cols="12" md="3" lg="2" class="pt-0 pr-0">
            <Sidebar />
          </v-col>
          <v-col cols="12" md="9" lg="10">
            <router-view />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </v-app>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import Header from "./header/Header";
import SidebarDropdown from "@/components/SidebarDropdown";
import SearchBox from "@/components/SearchBox";
import AppBanner from "@/components/AppBanner";
import Sidebar from "@/components/Sidebar";

export default {
  name: "FullLayout",
  components: {
    Header,
    SidebarDropdown,
    SearchBox,
    AppBanner,
    Sidebar
  },
  computed: {
    ...mapState(["showbanner"]),
  },
};
</script>

<style lang="scss" scoped>
#default {
  background: #f6f6f6;
}
</style>