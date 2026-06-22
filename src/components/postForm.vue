<script setup>
defineProps({
  formTitle: {
    type: String,
    default: 'Create Post'
  },
  submitLabel: {
    type: String,
    default: 'Save Post'
  }
});

const model = defineModel({
  type: Object,
  default: () => ({
    title: '',
    content: ''
  })
});

const emit = defineEmits(['submit']);

const handleSubmit = () => {
  emit('submit', model.value);
};
</script>

<template>
  <form class="post-form" @submit.prevent="handleSubmit">
    <h1 class="page-title mb-4">
      {{ formTitle }}
    </h1>

    <div class="mb-4">
      <label for="postTitle" class="form-label">Post Title</label>
      <input
        id="postTitle"
        v-model="model.title"
        type="text"
        class="form-control"
        placeholder="Enter post title"
      />
    </div>

    <div class="mb-4">
      <label for="postContent" class="form-label">Post Content</label>
      <textarea
        id="postContent"
        v-model="model.content"
        class="form-control"
        rows="10"
        placeholder="Write your post content"
      ></textarea>
    </div>

    <button type="submit" class="btn btn-primary px-4">
      {{ submitLabel }}
    </button>
  </form>
</template>