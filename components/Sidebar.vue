<template>
  <v-list class="white d-md-block d-none">
    <v-subheader>{{ $t("Channels") }}</v-subheader>
    <v-list-item-group>
      <v-list-item
        @click="goToChannelPage(item.id)"
        v-for="(item, i) in channels"
        :key="i"
      >
        <v-list-item-avatar color="#00A1FF" size="30" class="my-0">
          <v-img :src="item.image"></v-img>
        </v-list-item-avatar>
        <v-list-item-content class="py-2">
          <v-list-item-title v-text="item.name"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
    <v-btn text class="blue--text" id="allChannels" @click="goToAllChannelsPage">{{ $t("All channels") }}</v-btn>
    <v-subheader>{{ $t("Topics") }}</v-subheader>
    <v-list-item-group>
      <v-list-item
        v-for="(item, i) in categories"
        :key="i"
        @click="goToCategoryPage(item.id)"
      >
        <v-list-item-content class="py-2">
          <v-list-item-title v-text="item.name"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import RedirectMixin from "~/mixins/RedirectMixin";
export default {
  name: "Sidebar",
  mixins: [RedirectMixin],
  computed: {
    ...mapGetters("channel", ["channels"]),
    ...mapGetters("category", ["categories"]),
  },
  methods: {
    ...mapActions("channel", ["getChannelList"])
  }
};
</script>

<style scoped lang="scss">
::v-deep .theme--light.v-list-item {
  transition: none;
  &::before {
    transition: none;
  }

  &:hover::before {
    background-color: white;
    transition: none;
  }

  &:focus::before {
    background-color: white;
    transition: none;
  }
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
::v-deep #allChannels
{
  font-size: 14px;
}
</style>
