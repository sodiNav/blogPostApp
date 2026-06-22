<script setup>
defineProps({
  posts: {
    type: Array,
    default: () => []
  }
});
</script>

<template>
  <aside class="featured-posts">
    <h2 class="section-label mb-3">Featured Posts</h2>

    <div v-if="posts.length" class="vstack gap-3">
      <RouterLink
        v-for="post in posts"
        :key="post._id"
        :to="`/posts/${post._id}`"
        class="featured-post-item text-decoration-none"
      >
        <small class="text-secondary d-block mb-1">
          {{ post.userId?.username || 'Unknown Author' }}
        </small>

        <h3 class="featured-post-title mb-0">
          {{ post.title }}
        </h3>
      </RouterLink>
    </div>

    <p v-else class="text-secondary mb-0">
      No featured posts available.
    </p>
  </aside>
</template>