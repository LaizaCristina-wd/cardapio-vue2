import { createRouter, createWebHistory } from "vue-router";

const HomeView = () => import('@/views/HomeView.vue')
const OverviewView = () => import('@/views/OverviewView.vue')
const ProductionView = () => import('@/views/ProductionView.vue')
const MenuView = () => import('@/views/MenuView.vue')
const LogisticaView = () => import('@/views/LogisticaView.vue')
const RelatorioView = () => import('@/views/RelatorioView.vue')
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
   {
    path: '/home',
    name: 'home',
    component: HomeView
  },
  {
  path: '/Overview',
  name: 'Overview',
  component: OverviewView,
   meta: { requiresSidebar: true } 
}, 
  {
    path: '/producao',
    name: 'producao',
    component: ProductionView,
     meta: { requiresSidebar: true }
  },
  {
    path: '/menu',
    name: 'menu',
    component: MenuView,
     meta: { requiresSidebar: true }
  },
  {
    path: '/logistica',
    name: 'logistica',
    component: LogisticaView,
     meta: { requiresSidebar: true }
  },
  {
    path: '/relatorio',
    name: 'relatorio',
    component: RelatorioView,
     meta: { requiresSidebar: true }
  }
 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router