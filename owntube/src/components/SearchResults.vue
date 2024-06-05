<template>
    <div>
        <Header />
        <div class="search-results">
            <h1>Search Results</h1>
            <div v-if="isLoading">Loading...</div>
            <div v-else>
                <div v-if="results.length === 0">No results found</div>
                <div v-else>
                    <div v-for="result in results" :key="result.id && result.id.videoId" class="search-result">
                        <div v-if="result.id && result.id.kind === 'youtube#video'" class="video-info">
                            <img :src="getThumbnail(result.id.videoId)" @error="setDefaultImage" alt="Thumbnail"
                                class="thumbnail">
                            <div>
                                <h2>{{ result.snippet.title }}</h2>
                                <p>{{ result.snippet.description }}</p>
                            </div>
                        </div>
                        <div v-else-if="result.id && result.id.kind === 'youtube#channel'" class="channel-info">
                            <img :src="getAvatar(result.id.channelId)" alt="Avatar" class="avatar">
                            <div>
                                <h2>{{ result.snippet.channelTitle }}</h2>
                                <p>{{ result.snippet.description }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Header from './Header.vue';
export default {
    name: 'SearchResults',
    components: {
        Header,
    },
    props: ['query'],
    data() {
        return {
            isLoading: false,
            results: [],
        };
    },
    methods: {
        search() {
            this.isLoading = true;
            // Replace this with your actual search API
            fetch(`http://localhost:3000/api/search?query=${this.query}`)
                .then(response => response.json())
                .then(data => {
                    this.results = data;
                    console.log('Search results:', data);
                    this.isLoading = false;
                })
                .catch(error => {
                    console.error('Error:', error);
                    this.isLoading = false;
                });
        },
        getAvatar(channelId) {
            return `http://localhost:3000/api/avatar?channelId=${channelId}`;
        },
        getThumbnail(videoId) {
            //Si il ne trouve pas la vidéo, il renvoie une image par défaut
            return `http://localhost:3000/api/thumbnail?videoId=${videoId}`;

        },
        setDefaultImage(event) {
            event.target.src = '/img/thumbnail.png';
        },
    },
    watch: {
        query(newQuery) {
            console.log('Query changed:', newQuery)
            this.search();
        },
    },
    created() {
        this.search();
    },
};
</script>

<style scoped>
* {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif, sans-serif;
}

.thumbnail {
    max-width: 500px;
    min-width: 240px;
    object-fit: cover;
    margin-right: 10px;
    border-radius: 12px;
}

.avatar {
    max-width: 100px;
    min-width: 50px;
    object-fit: cover;
    margin-right: 10px;
    border-radius: 50%;
}

.search-results {
    margin-top: 20px;
}

.video-info {
    display: flex;
    align-items: start;
}

.channel-info {
    display: flex;
    align-items: start;
}

.search-result {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
}

.search-result h3 {
    margin-top: 0;
}

.search-result p {
    margin-bottom: 10px;
}
</style>