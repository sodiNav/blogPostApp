<script setup>
    import { reactive, watch, onBeforeMount, computed, ref } from 'vue';
    import { useGlobalStore } from '../stores/global.js';
    import { useRouter } from 'vue-router';
    import { Notyf } from 'notyf';
    import api from '../api.js';
    import PostCard from '../components/PostCard.vue';
    import FeaturedPost from '@/components/FeaturedPost.vue';

    const store = useGlobalStore();
    const router = useRouter();
    const notyf = new Notyf();

    const posts = reactive({ data: [] });
    const errorMsg = ref('');

    const featuredPosts = computed(() => {
    return [...posts.data]
        .sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn))
        .slice(0, 3);
    });

    onBeforeMount(() => {
    if (!store.user.token) {
        router.push({ path: '/login' });
    }
    });

    async function getPosts() {
    try {
        const { data } = await api.get('/posts/getPosts');

        posts.data = data.posts;

        console.log('posts', posts.data);
        console.log('featured posts', featuredPosts.value);
    } catch (e) {
        const message =
        e.response?.data?.message ||
        'An error has occurred while retrieving posts';

        errorMsg.value = message;
        notyf.error(message);
    }
    }

    watch(
    () => store.user.token,
    async (token) => {
        if (token) {
        await getPosts();
        }
    },
    { immediate: true }
    );
</script>

<template>
  <main>
    <section class="home-hero">
      <div class="container">
        <div class="row align-items-center gy-4">
          <div class="col-lg-7">
            <p class="section-label mb-3">Lumina Editorial</p>

            <h1 class="hero-title mb-4">
              A quiet space for thoughtful writing.
            </h1>

            <p class="hero-text mb-4">
              Read focused blog posts, explore ideas, and share reflections
              through a simple editorial publishing space.
            </p>

            <router-link to="/posts/create" class="btn btn-primary px-4 py-2">
              Start Writing
            </router-link>
          </div>

          <div class="col-lg-5">
            <div class="hero-panel">
              <p class="section-label mb-3">Latest Thought</p>

              <h2 class="hero-panel-title mb-3">
                {{ featuredPosts[0]?.title }}
              </h2>

              <p class="text-secondary mb-0">
                {{ featuredPosts[0]?.content }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container py-5">
      <div class="row g-4">
        <div class="col-lg-8">
          <div class="d-flex justify-content-between align-items-end mb-4">
            <div>
              <p class="section-label mb-2">All Posts</p>
              <h2 class="section-heading mb-0">Recent Publications</h2>
            </div>
          </div>

          <div v-if="posts.data.length" class="row g-4">
            <div
              v-for="post in posts.data"
              :key="post._id"
              class="col-12 col-md-6"
            >
              <PostCard :post="post" />
            </div>
          </div>

          <p v-else class="text-secondary">
            No posts available.
          </p>
        </div>

        <div class="col-lg-4">
          <div class="home-sidebar">
            <FeaturedPost :posts="featuredPosts" />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.home-hero {
  background-color: var(--app-surface);
  border-bottom: 1px solid var(--app-border);
  padding: 5rem 0;
}

.hero-title {
  max-width: 720px;
  font-size: clamp(2.25rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.hero-text {
  max-width: 620px;
  color: var(--app-muted);
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.hero-panel {
  background-color: var(--app-surface-muted);
  border: 1px solid var(--app-border);
  border-radius: 0.5rem;
  padding: 2rem;
}

.hero-panel-title {
  font-size: 1.5rem;
  font-weight: 700;
}

.home-sidebar {
  position: sticky;
  top: 6rem;
}

@media (max-width: 991.98px) {
  .home-hero {
    padding: 3.5rem 0;
  }

  .home-sidebar {
    position: static;
  }
}

@media (max-width: 575.98px) {
  .home-hero {
    padding: 2.5rem 0;
  }

  .hero-panel {
    padding: 1.25rem;
  }
}
</style>