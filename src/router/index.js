import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"
import CadastroView from "../views/CadastroView.vue"
import ControleView from "../views/ControleView.vue"
import CardapioView from "../views/CardapioView.vue"

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView
  },
  {
    path: "/cadastro",
    name: "cadastro",
    component: CadastroView
  },
  {
    path: "/controle",
    name: "controle",
    component: ControleView
  },
  { 
    path: "/cardapio",
    name: "cardapio",
    component: CardapioView 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router