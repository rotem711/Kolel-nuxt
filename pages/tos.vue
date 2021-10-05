<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div style="direction: ltr;" v-html="content"></div>
      </v-col>
    </v-row>
  </v-container>
  
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Tos",
  layout: "DefaultLayout",
  data: () => ({
    loading: false,
    content: null
  }),

  methods: {
    ...mapActions(["getTos"]),
  },

  async fetch() {
    this.content = await this.getTos();
  },
};
</script>

<style lang="scss" scoped>
</style>
