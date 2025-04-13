import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import { setupQuasar } from './config/quasarConfig';
import 'quasar/src/css/index.sass';

import '@/assets/styles/index.scss';

const app = createApp(App);

setupQuasar(app);
app.use(createPinia());
app.use(router);
app.mount('#app');
