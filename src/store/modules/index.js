import { createStore } from 'vuex'
import auth from './modules/auth'
import cart from './modules/cart'

const STORAGE_KEY = 'cardapio-vuex'

function loadPersisted() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

const persisted = loadPersisted()
const store = createStore({ modules: { auth, cart } })

if (persisted?.cart) store.commit('cart/HYDRATE', persisted.cart)
if (persisted?.auth) store.commit('auth/HYDRATE', persisted.auth)

let persistTimer = null
store.subscribe((_mutation, state) => {
    if (persistTimer) return
    persistTimer = setTimeout(() => {
        persistTimer = null
        const snapshot = {
            cart: { items: state.cart.items },
            auth: { user: state.auth.user },
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
    }, 200)
})

export default store