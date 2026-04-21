import { createRouter, createWebHistory } from "vue-router";

const HomeView = () => import('@/views/HomeView.vue')
const OverviewView = () => import('@/views/OverviewView.vue')
const ProductionView = () => import('@/views/ProductionView.vue')

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
 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router