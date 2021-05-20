export const actions = {
    setAccessToken({ commit }, payload) {
        localStorage.setItem("AccessToken", payload)
        commit("setAccessToken", payload)
    },
    setError({ commit }, payload) {
        commit("setError", payload)
    },
    setLoading({ commit }, payload) {
        commit("setLoading", payload)
    },
}
