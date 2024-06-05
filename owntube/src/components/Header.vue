<template>
    <header>
        <div class="container">
            <div @click="this.$router.push({ name: 'HomeView' })" class="app-name">OwnTube</div>
            <div>
                <input type="text" v-model="searchTerm" placeholder="Search" class="search-bar">
                <button @click="search(searchTerm)">Search</button>
            </div>
            <div class="icons">
                <img src="/img/setting.png" alt="Settings" class="icon">
                <img src="/img/user.png" alt="User" class="icon">
            </div>

        </div>
    </header>
</template>

<script>
export default {
    name: 'HeaderView',
    data() {
        return {
            searchTerm: '',
        };
    },
    methods: {
        search(searchTerm) {
            console.log('Search term:', searchTerm)
            this.$router.push({ name: 'SearchResults', params: { query: this.searchTerm } });
        },
    },
};
</script>

<style scoped>
/* Styles pour la barre de navigation */
* {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif, sans-serif;
}
header {
    margin: 0 auto;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000;
    background-color: white;
    padding: 10px 0;
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
    border-radius: 12px;
    border: 1px solid #ccc;
}

button {
    height: 40px;
    margin-left: 10px;
    background-color: #fff;
    border: none;
    cursor: pointer;
    border-radius: 12px;
    border: 1px solid #ccc;
}

.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}

.app-name {
    cursor: pointer;
}

.search-bar {
    /* Styles for the search bar */
}

.icons {
    display: flex;
    flex-direction: row;
    align-items: space-between;
    gap:20px;
}

.icon {
    width: 40px;
}
</style>