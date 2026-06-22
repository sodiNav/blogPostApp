<script setup>
    import { ref, reactive, watch, onBeforeMount } from 'vue';
    import { useGlobalStore } from '../stores/global.js';
    import { useRouter } from 'vue-router';
	import api from '../api.js';
    import MovieCard from '../components/PostCard.vue';
    import AdminDashboard from '../adminPages/AdminDashboard.vue';

    const store = useGlobalStore();
    const movies = reactive({data:[]});
    const router = useRouter();
    const errorMsg = ref("");

    onBeforeMount(() => {
        if(!store.user.token){
            return router.push({path: '/login'})
        }
    })

    async function getMovies(){
        try {
            let { data } = await api.get('/movies/getMovies');
            movies.data = data.movies;
        } catch(e) {
            let message = e.response?.data?.message || "An error have occured while retrieving movies"

            errorMsg.value = message;
            notyf.error(message);
        }
    }
    
    watch(store.user, async (currentValue, oldValue) => {
        await getMovies();
    }, {
        immediate: true
    });
</script>

<template>
    <div v-if="store.user.isAdmin">
        <AdminDashboard :moviesData="movies" @refreshMovies="getMovies" />
    </div>
    
    <div v-else>
        <h1 class="text-center mt-5">Movies Catalog</h1>
    
        <div class="row mt-3 g-3">
            <MovieCard v-for="movie in movies.data" :movieData="movie" />
        </div>
    </div>
</template>

<style scoped>

</style>