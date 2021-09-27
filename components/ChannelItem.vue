<template>
  <v-card
    class="pa-0 px-md-4 px-lg-4 transparent text-center d-flex flex-column mx-auto channel-item"
    aria-controls
    elevation="0"
    max-width="350px"
  >
    <v-list-item class="d-flex">
      <v-list-item-avatar size="80" color="grey my-0" @click="viewChannel">
        <v-img :src="channel.image"></v-img>
      </v-list-item-avatar>

      <v-list-item-content class="text-right ml-4">
        <v-list-item-title class="black--text channel-name" @click="viewChannel">{{ channel.name }}</v-list-item-title>
        <v-list-item-subtitle class="grey--text mt-2">{{ channel.followers_count | formatViews }} {{ $t('Followers') }}</v-list-item-subtitle>
      </v-list-item-content>

      <div>
        <v-btn width="80px" :class="is_following ? 'white black--text subtitle-1' : 'red white--text subtitle-1'" @click="follow(!is_following)">{{ is_following ? $t('Unfollow') : $t('Follow') }}</v-btn>
      </div>
    </v-list-item>
  </v-card>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "ChannelItem",
  props: {
    channel: Object
  },
  data() {
    return {
      is_following: this.channel.is_following
    }
  },
  methods: {
    ...mapActions("channel", ["followChannel"]),
    follow(value) {
      let payload = {
        channelId: this.channel.id,
        follow: value
      }

      this.followChannel(payload).then(res => {
        if (res) {
          this.is_following = value;
        }
      })
    },

    viewChannel() {
      this.$router.push({ name: 'Channel', params: { id: this.channel.id }});
    }
  }
}
</script>

<style scoped>
.v-card {
  border: none;
  direction: rtl;
}

.channel-name {
  white-space: unset;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 100px;
}

@media (max-width: 350px) {
  .v-list-item {
    flex-wrap: wrap;    
  }
}

.v-list-item__content {
  min-width: 100px;
}
</style>
