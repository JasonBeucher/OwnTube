<template>
  <Header />
  <div class="video-player">
    <div v-if="isLoading">Loading video...</div>
    <video v-else controls :src="videoUrl" width="1280" height="720" type="video/mp4"></video>
    <div v-if="!isLoading">Duration: {{ duration }} seconds</div>
  </div>
</template>

<script>
import Header from './Header.vue';
export default {
  name: 'VideoPlayer',
  components: {
    Header,
  },
  props: ['id'],
  data() {
    return {
      videoUrl: '',
      isLoading: true,
      duration: 2,
    };
  },
  async mounted() {
    // Set the video URL directly to use the streaming endpoint
    this.videoUrl = `http://localhost:3000/api/video/?videoId=${this.id}`;
    this.isLoading = false;
    
    
  }
};
</script>

<style scoped>
.video-player {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  margin: 40px;
}

video {
  margin-bottom: 20px;
}
</style>
