import Vue from 'vue'
import VueSocialSharing from 'vue-social-sharing';

Vue.use(VueSocialSharing, {
    networks: {
        fakeblock: 'https://fakeblock.com/share?url=@url&title=@title'
    }
});
