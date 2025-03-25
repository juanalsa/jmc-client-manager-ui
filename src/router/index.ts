import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Login from '../views/Login.vue';
import MainPage from '../views/MainPage.vue';
import ViewClients from '../views/ViewClients.vue';
import CreateClient from '../views/CreateClient.vue';
import CreateStatus from '../views/CreateStatus.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login,
      meta: { requiresAuth: false }
    },
    {
      path: '/main',
      name: 'main',
      component: MainPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/view-clients',
      name: 'viewClients',
      component: ViewClients,
      meta: { requiresAuth: true }
    },
    {
      path: '/create-client',
      name: 'createClient',
      component: CreateClient,
      meta: { requiresAuth: true }
    },
    {
      path: '/create-status',
      name: 'createStatus',
      component: CreateStatus,
      meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/');
  } else if (to.path === '/' && authStore.isAuthenticated) {
    next('/main');
  } else {
    next();
  }
});

export default router;