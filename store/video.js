import utils from '@/utils/functions.js';

export const state = () => ({
    recommendedVideos: []
});

export const getters = {
    recommendedVideos: state => state.recommendedVideos
};

export const mutations = {
    GET_RECOMMENDED_VIDEOS: (state, payload) => {
        state.recommendedVideos = Object.assign({}, payload);
    },
};

export const actions = {
    async getRecommendedVideos ({ commit }, payload = null) {
        let result = await this.$axios.get(`/videos/recommended.json?limit=${payload.limit}&offset=0`);
        commit("GET_RECOMMENDED_VIDEOS", result.data.videos);
        return result.data;
    },

    async searchVideos ({ commit }, payload = null) {
        let result = await this.$axios.get(`/videos.json?limit=${payload.limit}&offset=${payload.offset}&term=${payload.term}`);
        return result.data;
    },

    async getRecentVideoList ({ commit }, payload = null) {
        let result = await this.$axios.get('/videos.json?limit=5&offset=0');
        return result.data;
    },

    async getVideoList ({ commit }, payload = null) {
        let url = utils.constructGetUrl('/videos.json', payload);
        let result = await this.$axios.get(url);
        return result.data;
    },

    async getVideoDetail ({ commit }, id) {
        let result = await this.$axios.get(`/videos/${id}.json`);
        return result.data;
    },

    async markWatch ({ commit }, payload) {
        let result = await this.$axios.post(`/videos/${payload.id}/mark_watch.json`, payload);
        return result.data;
    },

    async getFavoriteVideoList ({ commit }) {
        let url = '/videos/feed.json?long=true';
        let result = await this.$axios.get(url);
        return result.data;
    },
};
