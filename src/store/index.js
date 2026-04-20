import { createStore } from 'vuex'
import auth from './modules/auth'

const STORAGE_KEY = 'selo-real-vuex'

function loadPersisted() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

const persisted = loadPersisted()

const store = createStore({
    modules: { auth },
})

if (persisted?.auth) store.commit('auth/HYDRATE', persisted.auth)

let persistTimer = null
store.subscribe((_mutation, state) => {
    if (persistTimer) return
    persistTimer = setTimeout(() => {
        persistTimer = null
        const snapshot = {
            auth: { user: state.auth.user },
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
    }, 200)
})

export default store