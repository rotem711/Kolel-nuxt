export default {
  methods: {
    goToAllChannelsPage() {
      window.location.href = "/channels";
    },
    goToCategoryPage(id) {
      window.location.href = '/category/' + id;
    },
    goToChannelPage(id) {
      window.location.href = '/channel/' + id;
    },
    goToVideoPage(id) {
      window.location.href = '/videos/' + id;
    }
  }
};
