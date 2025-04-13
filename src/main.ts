import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import { setupQuasar } from './config/quasarConfig';
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css';
import '@quasar/extras/material-icons/material-icons.css';
import '@quasar/extras/material-symbols-outlined/material-symbols-outlined.css';
import '@quasar/extras/material-symbols-rounded/material-symbols-rounded.css';
import 'quasar/dist/quasar.prod.css';
import 'quasar/src/css/index.sass';

import '@/assets/styles/index.scss';

const app = createApp(App);

setupQuasar(app);
app.use(createPinia());
app.use(router);
app.mount('#app');
