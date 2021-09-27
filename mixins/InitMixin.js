import { mapActions } from "vuex";
import utils from '~/utils/functions.js';
export default {
  data() {
    return {
      dialog: false,
      isMounted: false
    };
  },
  computed: {
    isMobile: function () {
      return this.isMounted && ['xs'].includes(this.$vuetify.breakpoint.name);
    }
  },
  methods: {
    ...mapActions(["showBanner"]),
    ...mapActions("auth", ["setUserStatus", "setUserInfo", "signAnonymous"]),
    ...mapActions("channel", ["getChannelList", "setChannels"]),
    ...mapActions("category", ["getCategoryList", "setCategories"]),
    checkToken (token) {
      var decoded = utils.parseJwt(token);
      var expiry = decoded.expiry;
      if (expiry) {
        var expiryDate = new Date(expiry * 1000);
        if (new Date() < expiryDate) {
          this.setUserStatus(token);
        }
      } else {
        this.setUserStatus(null);
      }
    },
    async initialize() {
      let payload = {
        limit: 15,
        offset: 0,
        sort_by: 'views',
        sort_dir: 'desc'
      }

      this.getChannelList(payload).then(res => {
        this.setChannels(res.channels);
      })

      this.getCategoryList().then((res) => {
        this.setCategories(res.categories);
      });
    }
  },
  watch: {
    isMobile(val) {
      if (val) {
        console.log(this.$vuetify.breakpoint.name)
        if (process.browser) {
          var hidebanner = localStorage.getItem("hidebanner");
          if (hidebanner) {
            this.showBanner(false);
          } else {
            this.showBanner(true);
          }
        }
      }
    }
  },
  mounted() {
    this.isMounted = true;
  },
  async created() {
    if (process.browser) {
      var token = localStorage.getItem("token");
    }
    if (token) {
      this.checkToken(token);
    }
    this.initialize();
    if (process.browser) {
      var userInfo = localStorage.getItem("user");
    }
    if (userInfo) {
      this.setUserInfo(JSON.parse(userInfo));
    }
  }
};
