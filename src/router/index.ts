import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/pages/MainView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/pages/MainView.vue'),
    },
  ],
})

export default router
