import { createRouter, createWebHistory } from 'vue-router';
import Home from '../components/Home.vue';
import VideoPlayer from '../components/VideoPlayer.vue';
import SearchResults from '@/components/SearchResults.vue';

const routes = [
  { path: '/', name: 'HomeView', component: Home },
  { path: '/video/:id', name: 'VideoPlayer', component: VideoPlayer, props: true },
  { path: '/search/:query', name: 'SearchResults', component: SearchResults, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;