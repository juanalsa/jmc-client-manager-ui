import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import App from './App.vue';
import router from './router';
import './style.css';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

const app = createApp(App);
const pinia = createPinia();

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light'
  }
});

app.use(pinia);
app.use(router);
app.use(vuetify);

app.mount('#app');