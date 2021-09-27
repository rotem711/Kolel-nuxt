import APIService from "~/http.js";
const API = new APIService();

export const state = () => ({
    user: null,
    token: null,
});

export const getters = {
    user: state => state.user,
    token: state => state.token
};

export const mutations = {
    SET_TOKEN: (state, payload) => {
        state.token = payload;
    },

    SET_USER_INFO: (state, payload) => {
        state.user = Object.assign({}, payload);
    },
};

export const actions = {
    async getResetPasswordLink ({ commit }, payload) {
        var result = await API.post('/users/forgot_password.json', payload);
        return result.data;
    },

    async setNewPassword ({ commit }, payload) {
        var result = await API.post('/users/set_new_password', payload);
        return result.data;
    },

    async signUser ({ commit }, payload) {
        var result = await API.post('/users/login', payload);
        if (result.data && result.data.token) {
            commit("SET_TOKEN", result.data.token);
        }
        if (result.data && result.data.user) {
            commit("SET_USER_INFO", result.data.user);
        }
        return result.data;
    },

    async signAnonymous ({ commit }) {
        var result = await API.post('/users/signup_anonymous', { device: 'web' });
        return result.data;
    },

    async signUp ({ commit }, payload) {
        var result = await API.post('/users', payload);
        if (result.data && result.data.token) {
            commit("SET_TOKEN", result.data.token);
        }
        if (result.data && result.data.user) {
            commit("SET_USER_INFO", result.data.user);
        }
        return result.data;
    },

    async googleLogin ({ commit }, payload) {
        let result = await API.post(`/users/google_login`, payload);
        if (result.data && result.data.token) {
            commit("SET_TOKEN", result.data.token);
        }
        if (result.data && result.data.user) {
            commit("SET_USER_INFO", result.data.user);
        }
        return result.data;
    },

    async facebookLogin ({ commit }, payload) {
        let result = await API.post(`/users/facebook_login`, payload);
        if (result.data && result.data.token) {
            commit("SET_TOKEN", result.data.token);
        }
        if (result.data && result.data.user) {
            commit("SET_USER_INFO", result.data.user);
        }
        return result.data;
    },

    async setUserStatus ({ commit }, payload) {
        commit("SET_TOKEN", payload);
        return true;
    },

    async setUserInfo ({ commit }, payload) {
        commit("SET_USER_INFO", payload);
        return true;
    },
};
