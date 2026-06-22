<script setup>
import { computed, onBeforeMount, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Notyf } from 'notyf';
import api from '../api';

const route = useRoute();
const router = useRouter();
const notyf = new Notyf();

const postForm = reactive({
  title: '',
  content: ''
});

const isLoading = ref(false);
const isSaving = ref(false);

const isEditMode = computed(() => {
  return Boolean(route.params.id);
});

const pageTitle = computed(() => {
  return isEditMode.value ? 'Edit Post' : 'Create New Post';
});

const submitLabel = computed(() => {
  return isEditMode.value ? 'Update Post' : 'Publish Post';
});

const getPostDetails = async () => {
  isLoading.value = true;

  try {
    const { data } = await api.get(`/posts/getPost/${route.params.id}`);

    postForm.title = data.post.title;
    postForm.content = data.post.content;
  } catch (e) {
    const message =
      e.response?.data?.message || 'Unable to retrieve post details';

    notyf.error(message);
    router.push('/profile');
  } finally {
    isLoading.value = false;
  }
};

const savePost = async () => {
  if (!postForm.title.trim()) {
    return notyf.error('Post title is required');
  }

  if (!postForm.content.trim()) {
    return notyf.error('Post content is required');
  }

  isSaving.value = true;

  try {
    if (isEditMode.value) {
      await api.patch(`/posts/updatePost/${route.params.id}`, {
        title: postForm.title,
        content: postForm.content
      });

      notyf.success('Post updated successfully');
    } else {
      await api.post('/posts/addPost', {
        title: postForm.title,
        content: postForm.content
      });

      notyf.success('Post created successfully');
    }

    router.push('/profile');
  } catch (e) {
    const message =
      e.response?.data?.message || 'Unable to save post. Please try again';

    notyf.error(message);
  } finally {
    isSaving.value = false;
  }
};

const deletePost = async () => {
  const confirmed = confirm('Are you sure you want to delete this post?');

  if (!confirmed) return;

  isSaving.value = true;

  try {
    await api.delete(`/posts/deletePost/${route.params.id}`);

    notyf.success('Post deleted successfully');
    router.push('/profile');
  } catch (e) {
    const message =
      e.response?.data?.message || 'Unable to delete post. Please try again';

    notyf.error(message);
  } finally {
    isSaving.value = false;
  }
};

onBeforeMount(async () => {
  if (isEditMode.value) {
    await getPostDetails();
  }
});
</script>

<template>
  <main class="post-editor-page">
    <section class="container py-5">
      <div class="editor-container">
        <RouterLink to="/profile" class="back-link mb-4 d-inline-block">
          ← Back to profile
        </RouterLink>

        <div class="editor-header mb-4">
          <p class="section-label mb-2">
            {{ isEditMode ? 'Update Publication' : 'New Publication' }}
          </p>

          <h1 class="page-title mb-0">
            {{ pageTitle }}
          </h1>
        </div>

        <div v-if="isLoading" class="editor-card text-secondary">
          Loading post details...
        </div>

        <form v-else class="editor-card" @submit.prevent="savePost">
          <div class="mb-4">
            <label for="title" class="form-label">Post Title</label>
            <input
              id="title"
              v-model="postForm.title"
              type="text"
              class="form-control form-control-lg"
              placeholder="Enter post title"
            />
          </div>

          <div class="mb-4">
            <label for="content" class="form-label">Post Content</label>
            <textarea
              id="content"
              v-model="postForm.content"
              class="form-control"
              rows="14"
              placeholder="Write your post content"
            ></textarea>
          </div>

          <div class="d-flex flex-column flex-sm-row justify-content-between gap-3">
            <button
              v-if="isEditMode"
              type="button"
              class="btn btn-outline-danger px-4"
              :disabled="isSaving"
              @click="deletePost"
            >
              Delete Post
            </button>

            <div class="ms-sm-auto d-flex flex-column flex-sm-row gap-3">
              <RouterLink to="/profile" class="btn btn-outline-secondary px-4">
                Cancel
              </RouterLink>

              <button
                type="submit"
                class="btn btn-primary px-4"
                :disabled="isSaving"
              >
                {{ isSaving ? 'Saving...' : submitLabel }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  </main>
</template>

<style scoped>
.post-editor-page {
  min-height: 100vh;
}

.editor-container {
  max-width: var(--app-reading-width);
  margin-inline: auto;
}

.editor-card {
  background-color: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius);
  padding: 2rem;
}

.editor-header {
  border-bottom: 1px solid var(--app-border);
  padding-bottom: 1.5rem;
}

@media (max-width: 575.98px) {
  .editor-card {
    padding: 1rem;
  }
}
</style>