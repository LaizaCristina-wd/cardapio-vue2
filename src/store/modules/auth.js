export default {
    namespaced: true,
    state: () => ({
        user: null,
    }),
    mutations: {
        SET_USER(state, user) {
            state.user = user
        },

        CLEAR_USER(state) {
            state.user = null
        },
        HYDRATE(state, payload) {
            if (payload?.user) state.user = payload.user
        },
    },
    actions: {
        login({ commit }, { username }) {
            const user = {
        username,
        role: 'Administrador',
        loggedAt: new Date().toISOString(),
      }

      localStorage.setItem('user', JSON.stringify(user))

      commit('SET_USER', user)
    },

        logout({ commit }) {
        localStorage.removeItem('user')
        commit('CLEAR_USER')
        },
        initAuth({ commit }) {
        const saved = localStorage.getItem('user')

      if (saved) {
        commit('HYDRATE', {
          user: JSON.parse(saved),
        })
      }
    },
    },
    getters: {
         user: (state) => state.user,
        isAuthenticated: (state) => state.user !== null,
        username: (state) => state.user?.username || '',
    },
}
