import {createApp} from 'vue';
import {userAPI} from '@/api';
import App from '@/App.vue';
import router from '@/router';
import socket from '@/socket/socket';
import Jinguji from 'jinguji';
import 'uno.css';

async function initApp() {
  const access_token = window.localStorage.getItem('access_token')
  if (access_token) {
    await userAPI.auth(access_token);
    window.$socket = socket(access_token);
  }
  const app = createApp(App);
  app.use(Jinguji)
  app.use(router);
  await router.isReady();
  app.mount('#app');
}

initApp().then(() => console.log('App ready'));
