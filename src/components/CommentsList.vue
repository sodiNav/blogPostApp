<script setup>
defineProps({
  comments: {
    type: Array,
    default: () => []
  }
});
</script>

<template>
  <section class="comments-section">
    <h2 class="section-heading mb-4">Comments</h2>

    <div v-if="comments.length" class="vstack gap-3">
      <article
        v-for="(comment, index) in comments"
        :key="index"
        class="comment-item"
      >
        <p class="post-meta mb-2">
          {{ comment.userId?.username || 'Anonymous User' }}
        </p>

        <p class="mb-0">
          {{ comment.comment }}
        </p>
      </article>
    </div>

    <p v-else class="text-secondary">
      No comments yet. Be the first to comment.
    </p>
  </section>
</template>