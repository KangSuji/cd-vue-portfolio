import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'main',
    component: () => import('@/views/pages/MainView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/pages/AboutView.vue'),
  },
  {
    path: '/trend',
    name: 'trend',
    component: () => import('@/views/pages/TrendView.vue'),
  },
  {
    path: '/detail/:category/:id',
    name: 'detail',
    component: () => import('@/views/pages/DetailView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
