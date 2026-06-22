<script setup>
    import { onBeforeMount } from 'vue';
    import { useGlobalStore } from "./stores/global";
    import Navbar from './components/Navbar.vue';
    import Footer from './components/Footer.vue';

    const { getUserDetails } = useGlobalStore();

    onBeforeMount(()=>getUserDetails(localStorage.getItem("token")))
</script>

<template>
    <Navbar />

    <div class="container-fluid">
        <router-view />
    </div>

    <Footer />
</template>

<style scoped>

</style>