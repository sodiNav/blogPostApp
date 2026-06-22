<script setup>
import { onBeforeMount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Notyf } from 'notyf';
import api from '../api';
import { formatDate } from '../utils/dateFormatter';

const router = useRouter();
const notyf = new Notyf();

const posts = reactive({ data: [] });
const isLoading = ref(false);

const getAllPosts = async () => {
  isLoading.value = true;

  try {
    const { data } = await api.get('/posts/getPosts');
    posts.data = data.posts || [];
  } catch (e) {
    posts.data = [];

    const message =
      e.response?.data?.message || 'Unable to retrieve posts';

    notyf.error(message);
  } finally {
    isLoading.value = false;
  }
};

const deletePost = async (postId) => {
  const confirmed = confirm('Are you sure you want to delete this post?');

  if (!confirmed) return;

  try {
    await api.delete(`/posts/deletePost/${postId}`);

    notyf.success('Post deleted successfully');
    await getAllPosts();
  } catch (e) {
    const message =
      e.response?.data?.message || 'Unable to delete post';

    notyf.error(message);
  }
};

onBeforeMount(() => {
  getAllPosts();
});
</script>

<template>
  <main class="admin-dashboard-page">
    <section class="container py-5">
      <div class="admin-header mb-4">
        <p class="section-label mb-2">Admin Dashboard</p>

        <div class="d-flex flex-column flex-md-row justify-content-between gap-3">
          <div>
            <h1 class="page-title mb-2">Post Management</h1>
            <p class="text-secondary mb-0">
              Review and remove blog posts from the system.
            </p>
          </div>

          <div class="admin-stat-card">
            <p class="section-label mb-1">Total Posts</p>
            <h2 class="mb-0">{{ posts.data.length }}</h2>
          </div>
        </div>
      </div>

      <div class="admin-table-card">
        <div v-if="isLoading" class="p-4 text-secondary">
          Loading posts...
        </div>

        <div v-else-if="posts.data.length" class="table-responsive">
          <table class="table admin-table align-middle mb-0">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Content</th>
                <th>Posted On</th>
                <th class="text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="post in posts.data" :key="post._id">
                <td class="admin-title-cell">
                  {{ post.title }}
                </td>

                <td>
                  {{ post.userId?.username || 'Unknown Author' }}
                </td>

                <td class="admin-content-cell">
                  {{ post.content }}
                </td>

                <td>
                  {{ formatDate(post.createdOn) }}
                </td>

                <td class="text-end">
                  <button
                    class="btn btn-outline-danger btn-sm"
                    @click="deletePost(post._id)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="p-4 text-secondary">
          No posts found.
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.admin-dashboard-page {
  min-height: 100vh;
  background-color: var(--app-bg);
}

.admin-header {
  border-bottom: 1px solid var(--app-border);
  padding-bottom: 1.5rem;
}

.admin-stat-card {
  min-width: 180px;
  background-color: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius);
  padding: 1rem 1.25rem;
}

.admin-table-card {
  background-color: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius);
  overflow: hidden;
}

.admin-table thead th {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--app-muted);
  background-color: var(--app-surface-muted);
  border-bottom: 1px solid var(--app-border);
  white-space: nowrap;
}

.admin-table tbody td {
  border-bottom: 1px solid var(--app-border);
  color: var(--app-text);
  vertical-align: middle;
}

.admin-table tbody tr:last-child td {
  border-bottom: 0;
}

.admin-title-cell {
  min-width: 180px;
  font-weight: 600;
}

.admin-content-cell {
  min-width: 280px;
  max-width: 420px;
  color: var(--app-muted);
  line-height: 1.5;
}

@media (max-width: 767.98px) {
  .admin-stat-card {
    width: 100%;
  }
}
</style>