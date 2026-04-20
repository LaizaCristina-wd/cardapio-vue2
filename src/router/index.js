import { createRouter, createWebHistory } from "vue-router";

const HomeView = () => import('@/views/HomeView.vue')
const DashboardView = () => import('@/views/DashboardView.vue')

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
  path: '/dashboard',
  name: 'dashboard',
  component: DashboardView
}
 
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router