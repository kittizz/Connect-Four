export const getters = {
    appTitle(state) {
        return state.appName
    },
    getUser(state) {
        return state.user
    },
    getError(state) {
        return state.error
    },
    getLoading(state) {
        return state.loading
    },
    getAccessToken(state) {
        return state.assess_token
    },
    isAuth(state) {
        if (state.user) {
            return state.user.uid !== null
        }
        return false
    },
}
