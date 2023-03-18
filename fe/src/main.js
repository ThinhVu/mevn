import {createApp} from 'vue';
import {userAPI} from '@/api';
import App from '@/App.vue';
import router from '@/router';
import useShadow from '@/directives/shadow'
import 'uno.css'

async function initApp() {
  const access_token = window.localStorage.getItem('access_token')
  if (access_token) {
    await userAPI.auth(access_token);
  }
  const app = createApp(App);
  useShadow(app);
  app.use(router);
  await router.isReady();
  app.mount('#app');
}

initApp().then(() => console.log('App ready'));
