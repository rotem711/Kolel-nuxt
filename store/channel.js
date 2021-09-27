import APIService from "~/http.js";
import utils from '~/utils/functions.js';
const API = new APIService();

export const state = () => ({
    recommendedChannels: [],
    channels: []
});

export const getters = {
    recommendedChannels: state => state.recommendedChannels,
    channels: state => state.channels
};

export const mutations = {
    GET_RECOMMENDED_CHANNELS: (state, payload) => {
        state.recommendedChannels = Object.assign({}, payload);
    },

    GET_CHANNELS: (state, payload) => {
        state.channels = Object.assign({}, payload);
    },
};

export const actions = {
    async getRecommendedChannelList ({ commit }, payload = null) {
        let result = await API.get('/channels/recommended.json?limit=6&offset=0');
        commit("GET_RECOMMENDED_CHANNELS", result.data.channels);
        return result.data;
    },

    async getChannelList ({ commit }, payload = null) {
        let url = utils.constructGetUrl(`/channels.json`, payload);
        let result = await API.get(url);
        return result.data;
    },

    async getChannelDetail ({ commit }, payload = null) {
        let result = await API.get(`/channels/${payload.channelId}.json`);
        return result.data;
    },

    async getChannelVideoList ({ commit }, payload = null) {
        let channelId = payload.channelId;
        delete payload['channelId'];
        let url = utils.constructGetUrl(`/channels/${channelId}/videos.json`, payload);
        let result = await API.get(url);
        return result.data;
    },

    async followChannel ({ commit, rootState }, payload = null) {
        let token = localStorage.getItem("token");
        if (!rootState.auth.user || !token) {
            window.location.href = "/auth";
            return false;
        }
        let channelId = payload.channelId;
        delete payload['channelId'];
        let result = await API.put(`channels/${channelId}/follow.json`, payload);
        if (result.status == 204) {
            return true;
        } else {
            return false;
        }
    },

    setChannels ({ commit }, payload = []) {
        commit("GET_CHANNELS", payload);
    }
};
