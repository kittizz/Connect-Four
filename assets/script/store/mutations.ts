export const mutations = {
    setUser(state, payload) {
        if (payload) {
            state.user = payload.providerData[0]
        } else {
            state.user = payload
        }
    },
    setError(state, payload) {
        state.error = payload
    },
    setLoading(state, payload) {
        state.loading = payload
    },
    setAccessToken(state, payload) {
        state.assess_token = payload
    },
}
