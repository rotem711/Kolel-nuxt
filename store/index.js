export const state = () => ({
    Sidebar_drawer: null,
    Customizer_drawer: false,
    SidebarColor: 'white',
    SidebarBg: '',
    showDropdownMenu: false,
    showSearch: false,
    showbanner: false
})

export const mutations = {
    SET_SIDEBAR_DRAWER(state, payload) {
        state.Sidebar_drawer = payload
    },
    SET_CUSTOMIZER_DRAWER(state, payload) {
        state.Customizer_drawer = payload
    },
    SET_SIDEBAR_COLOR(state, payload) {
        state.SidebarColor = payload
    },
    TOGGLE_DROPDOWN_MENU(state) {
        state.showDropdownMenu = !state.showDropdownMenu
    },
    SET_DROPDOWN_MENU(state, value) {
        state.showDropdownMenu = value
    },
    SET_SEARCHBOX(state, value) {
        state.showSearch = value
    },
    SET_BANNER(state, value) {
        state.showbanner = value
    },
}

export const actions = {
    toggleDropdownMenu({ commit }) {
        commit('TOGGLE_DROPDOWN_MENU');
    },
    setDropdownMenu({ commit }, value) {
        commit('SET_DROPDOWN_MENU', value);
    },
    setSearchbox({ commit }, value) {
        commit('SET_SEARCHBOX', value);
    },
    showBanner({ commit }, value) {
        commit('SET_BANNER', value);
    },
    async getTos({ commit }) {
        let headers = { 'content-type': 'application/x-www-form-urlencoded' };
        let result = await this.$axios.get(`/tos`, headers, 'text');
        return result.data;
    },
}

export const getters = {
    showDropdownMenu: (state) => state.showDropdownMenu,
    showSearch: (state) => state.showSearch,
    banner: (state) => state.showbanner
}
