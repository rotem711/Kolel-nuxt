import APIService from "~/http.js";
const API = new APIService();

export const state = () => ({
    categories: []
});

export const getters = {
    categories: state => state.categories
};

export const mutations = {
    GET_CATEGORIES: (state, payload) => {
        state.categories = Object.assign([], payload);
    },
};

export const actions = {
    async getCategoryList ({ commit }, payload = null) {
        let result = await API.get('/categories.json?limit=99&offset=0');
        return result.data;
    },

    async getCategoryDetail ({ commit }, payload = null) {
        let result = await API.get(`/categories/${payload.categoryId}.json`);
        return result.data;
    },

    async getCategoryVideoList ({ commit }, payload = null) {
        let result = await API.get(`/categories/${payload.categoryId}/videos.json?limit=${payload.limit}&offset=${payload.offset}`);
        return result.data;
    },

    setCategories ({ commit }, payload = []) {
        commit("GET_CATEGORIES", payload);
    }
};
