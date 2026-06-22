<script setup>
  import BannerComponent from '../components/BannerComponent.vue';
  import { reactive } from 'vue';

    const bannerProps = reactive({
        title: "404 - Not Found",
        tagline: "",
        destination: "Home",
        buttonLabel: "Back to Home"
    })
</script>

<template>
  <div class="container-fluid">
    <BannerComponent :bannerProps=bannerProps />
  </div>
</template>

<style scoped>

</style>