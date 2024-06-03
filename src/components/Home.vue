<template>
  <div id="app">
    <!-- Barre de navigation -->
    <header>
      <div class="container">
        <h1>OwnTube</h1>
        <input type="text" placeholder="Search">
        <button>Search</button>
      </div>
    </header>

    <!-- Section de vidéos recommandées -->
    <main>
      <div class="container">
        <h2>Recommended Videos</h2>
        <div class="video-grid">
          <router-link v-for="video in videos" :key="video.id" :to="{ name: 'VideoPlayer', params: { id: video.id } }" class="video">
            <img :src="getThumbnail(video.id)" :alt="video.snippet.title" @click="redirectToVideo(video.id)">
            <div class="video-info">
              <h3>{{ video.snippet.title }}</h3>
              <p>{{ video.snippet.channelTitle }}</p>
              <p v-if="video.statistics">
                {{ video.statistics.viewCount }} views • {{ formatDate(video.snippet.publishedAt) }}
              </p>
              <p v-else>No statistics available</p>
            </div>
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  name: 'HomeView',
  data() {
    return {
      videos: [],
    };
  },
  mounted() {
    axios.get('http://localhost:3000/api/videos') // Faites attention au CORS
      .then(response => {
        console.log('Videos fetched:', response.data)
        this.videos = response.data;
      })
      .catch(error => {
        console.error('Error fetching videos from the intermediary server:', error);
      });
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    getThumbnail(videoId) {
      return `http://localhost:3000/api/thumbnail?videoId=${videoId}`;
    },
    redirectToVideo(videoId) {
      this.$router.push({ name: 'VideoPlayer', params: { id: videoId } });
    },
  },
};
</script>

<style>
/* Styles pour la barre de navigation */
header {
  background-color: #f00;
  padding: 10px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

h1 {
  font-size: 24px;
  color: #fff;
  margin: 0;
}

input[type="text"] {
  width: 300px;
  height: 30px;
  margin-left: 20px;
  padding: 5px;
}

button {
  height: 40px;
  margin-left: 10px;
  background-color: #fff;
  border: none;
  cursor: pointer;
}

/* Styles pour la section de vidéos */
main {
  padding: 20px 0;
}

h2 {
  font-size: 20px;
  margin-bottom: 20px;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.video {
  background-color: #ddd;
  border-radius: 5px;
  overflow: hidden;
}

.video img {
  width: 100%;
  border-bottom: 1px solid #999;
}

.video-info {
  padding: 10px;
}

.video-info h3 {
  font-size: 16px;
  margin: 0;
}

.video-info p {
  font-size: 14px;
  color: #666;
  margin: 5px 0;
}
</style>
