import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import App from './App.vue'
import router from './router'
import './assets/theme.css'
import store from './store'

store.dispatch('auth/initAuth')
createApp(App)
.use(router)
.use(store)
.mount('#app')
