export default {
    namespaced: true,
    state: () => ({
        items: [],
    }),
    mutations: {
        ADD_ITEM(state, item) {
            const existing = state.items.find((i) => i.id === item.id)
            if (existing) {
                existing.quantity += 1
            } else {
                state.items.push({ ...item, quantity: 1 })
            }
        },
        REMOVE_ITEM(state, id) {
            state.items = state.items.filter((i) => i.id !== id)
        },
        DECREMENT_ITEM(state, id) {
            const it = state.items.find((i) => i.id === id)
            if (!it) return
            it.quantity -= 1
            if (it.quantity <= 0) {
                state.items = state.items.filter((i) => i.id !== id)
            }
        },
        CLEAR(state) {
            state.items = []
        },
        HYDRATE(state, payload) {
            if (Array.isArray(payload?.items)) state.items = payload.items
        },
    },
    actions: {
        addToCart({ commit }, item) {
            commit('ADD_ITEM', item)
        },
        removeFromCart({ commit }, id) {
            commit('REMOVE_ITEM', id)
        },
        decrement({ commit }, id) {
            commit('DECREMENT_ITEM', id)
        },
        clearCart({ commit }) {
            commit('CLEAR')
        },
    },
    getters: {
        items: (state) => state.items,
        count: (state) => state.items.reduce((acc, i) => acc + i.quantity, 0),
        total: (state) =>
            state.items.reduce((acc, i) => acc + i.price * i.quantity, 0),
        isEmpty: (state) => state.items.length === 0,
    },
}
