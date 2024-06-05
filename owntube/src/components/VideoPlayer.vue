<template>
  <Header />
  <div class="video-player">
    <div v-if="isLoading">Loading video...</div>
    <video v-else controls :src="videoUrl" width="1280" height="720" type="video/mp4"></video>
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
      isLoading: true, // Add a new data property to track loading state
    };
  },
  mounted() {
    // Fetch the video from the server
    fetch(`http://localhost:3000/api/video/?videoId=${this.id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch video');
        }
        // Assuming the server returns video content with the correct content type
        return response.blob();
      })
      .then(blob => {
        // Convert the blob into a URL for the video
        this.videoUrl = URL.createObjectURL(blob);
        this.isLoading = false; // Set isLoading to false when the video has loaded
      })
      .catch(error => {
        console.error('Error fetching video:', error);
        this.isLoading = false; // Set isLoading to false even if there was an error
      });
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