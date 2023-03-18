import {createRouter, createWebHistory} from 'vue-router';
import SignIn from '@/pages/SignIn.vue';
import SignUp from '@/pages/SignUp.vue';
import Home from '@/pages/Home.vue';
import {user} from '@/app-state.js';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {path: '/', component: Home},
    {path: '/sign-in', component: SignIn},
    {path: '/sign-up', component: SignUp},
  ]
}, {default: '/'})

const publicRoutes = ['/sign-in', '/sign-up']

router.beforeEach((to, from, next) => {
  console.log('to', to.path)
  if (publicRoutes.includes(to.path)) {
    return next()
  }

  if (user.value) {
    return next()
  }

  next('/sign-in')
})

export default router;
