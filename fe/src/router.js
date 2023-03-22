import {createRouter, createWebHistory} from 'vue-router';
import Auth from '@/pages/Auth.vue';
import Home from '@/pages/Home.vue';
import ApiDoc from '@/pages/ApiDoc.vue';
import {user} from '@/app-state.js';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path: '/', component: Home},
    {path: '/auth', component: Auth},
    {path: '/api-doc', component: ApiDoc},
  ]
}, {default: '/'})

const publicRoutes = ['/auth']

router.beforeEach((to, from, next) => {
  if (publicRoutes.includes(to.path)) {
    return next()
  }

  if (user.value) {
    return next()
  }

  next('/auth')
})

export default router;
