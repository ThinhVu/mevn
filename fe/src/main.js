import {createApp} from 'vue';
import App from '@/App.vue';
import router from '@/router';

import Jinguji from 'jinguji';
import 'uno.css';

async function initApp() {
  const app = createApp(App);
  app.use(Jinguji)
  app.use(router);
  await router.isReady();
  app.mount('#app');
}

initApp().then(() => console.log('App ready'));
