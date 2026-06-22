<script setup>
  import { formatDate } from '@/utils/dateFormatter';

  defineProps({
    post: {
      type: Object,
      default: () => ({})
    }
  });
  
</script>

<template>
  <article class="post-card h-100">
    <div class="post-card-body">
      <p class="post-meta mb-2">
        {{ post?.userId?.username || 'Unknown Author' }}
      </p>

      <h2 class="post-card-title">
        {{ post?.title || 'Untitled Post' }}
      </h2>

      <p class="post-card-excerpt">
        {{ post?.content || 'No content available.' }}
      </p>

      <div class="d-flex justify-content-between align-items-center mt-4">
        <small class="text-secondary">
          {{ formatDate(post?.createdOn) || 'No date' }}
        </small>

        <RouterLink
          class="btn btn-outline-primary btn-sm"
          :to="`/posts/${post?._id}`"
        >
          Read Post
        </RouterLink>
      </div>
    </div>
  </article>
</template>