import { createApp } from 'vue';
import App from './App.vue'; // Assuming App.vue is your main component
import router from './router/router.js';

const app = createApp(App);
app.use(router);
app.mount('#app');
