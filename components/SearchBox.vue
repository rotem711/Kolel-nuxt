<template>
  <div class="search-box mt-14 py-1" :class="{'pt-16': showbanner}" v-if="showSearch">      
    <v-autocomplete
      color="white"
      @input="changeRoute"
      v-model="select"
      :loading="loading"
      :items="items"
      item-value="id"
      item-text="title"
      :search-input.sync="search"
      cache-items
      class="mx-4"
      flat
      return-object
      hide-no-data
      hide-details
      :label="$t('Search')"
      solo-inverted
    ></v-autocomplete>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "SearchBox",
  watch: {
    search(val) {
      val && val !== this.select && this.querySelections(val);
    },
  },
  data: () => ({
    loading: false,
    items: [],
    search: null,
    select: null,
  }),
  computed: {
    ...mapState(["Sidebar_drawer", "showSearch", "showbanner"]),
  },
  methods: {
    ...mapActions("video", ["searchVideos"]),
    ...mapActions(["setSearchbox"]),
    hideSearchbox() {
      this.setSearchbox(false);
    },
    changeRoute(select) {      
      this.$router.push({ name: 'Video', params: { id: select.id }})
      this.hideSearchbox();
      this.select = 0;
    },
    async querySelections(v) {
      this.loading = true;
      this.searchVideos({ term: v }).then((res) => {
        this.items = res.videos;
        this.loading = false;
      });
    }
  },
};
</script>

<style scoped lang="scss">
.search-box {
  position: fixed;
  width: 100%;
  background: white;
}

.searchinput {
  position: absolute;
  width: 100%;
  margin: 0;
  left: 0;
  z-index: 10;
  padding: 0 15px;
}
</style>
