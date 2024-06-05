import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import VideoPlayer from '../components/VideoPlayer.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/video/:id', name: 'VideoPlayer', component: VideoPlayer, props: true }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;