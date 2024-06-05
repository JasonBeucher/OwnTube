<template>
  <div class="video-player">
    <video controls :src="videoUrl" width="800" height="600"></video>
  </div>
</template>

<script>


export default {
  name: 'VideoPlayer',
  props: ['id'],
  data() {
    return {
      videoUrl: ''
    };
  },
  mounted() {
    console.log(this.id)
    // Appel à l'API de votre serveur pour récupérer la vidéo
    fetch(`http://localhost:3000/api/video/${this.id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch video');
        }
        return response.blob();
      })
      .then(blob => {
        // Convertir le blob en URL de la vidéo
        this.videoUrl = URL.createObjectURL(blob);
      })
      .catch(error => {
        console.error('Error fetching video:', error);
      });
  }
};
</script>

<style scoped>
.video-player {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

video {
  margin-bottom: 20px;
}
</style>