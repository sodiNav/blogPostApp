<script setup>
import { onBeforeMount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Notyf } from 'notyf';
import api from '../api';
import { formatDate } from '../utils/dateFormatter';

const router = useRouter();
const notyf = new Notyf();

const user = reactive({ data: {} });
const posts = reactive({ data: [] });
const isLoading = ref(false);

const getProfile = async () => {
  try {
    const { data } = await api.get('/users/details');
    user.data = data.user;
  } catch (e) {
    const message =
      e.response?.data?.message || 'Unable to retrieve profile details';

    notyf.error(message);
    router.push('/login');
  }
};

const getUserPosts = async () => {
  isLoading.value = true;

  try {
    const { data } = await api.get('/posts/postsByUser');
    posts.data = data.posts || [];
  } catch (e) {
    posts.data = [];

    const message =
      e.response?.data?.message || 'Unable to retrieve your posts';

    notyf.error(message);
  } finally {
    isLoading.value = false;
  }
};

const goToEditor = () => {
  router.push(`/posts/create/`);
};

const editPost = (postId) => {
  router.push(`/posts/edit/${postId}`);
};

onBeforeMount(async () => {
  await getProfile();
  await getUserPosts();
});
</script>

<template>
  <main class="profile-page">
    <section class="container py-5">
      <div class="profile-header border-bottom pb-4 mb-5">
        <div class="row align-items-end gy-4">
          <div class="col-lg-8">
            <p class="section-label mb-2">Profile</p>

            <h1 class="profile-name mb-2">
              {{ user.data.username || 'Username' }}
            </h1>

            <p class="text-secondary mb-0">
              {{ user.data.email || 'user@email.com' }}
            </p>
          </div>

          <div class="col-lg-4 text-lg-end">
            <button class="btn btn-primary px-4" @click="goToEditor">
              + New Post
            </button>
          </div>
        </div>
      </div>

      <section>
        <div class="d-flex justify-content-between align-items-end mb-4">
          <div>
            <p class="section-label mb-2">My Posts</p>
            <h2 class="section-heading mb-0">Posts You Created</h2>
          </div>
        </div>

        <div v-if="isLoading" class="text-secondary">
          Loading posts...
        </div>

        <div v-else-if="posts.data.length" class="row g-4">
          <div
            v-for="post in posts.data"
            :key="post._id"
            class="col-12 col-md-6 col-lg-4"
          >
            <article class="profile-post-card h-100">
              <div class="profile-post-body">
                <p class="section-label mb-3">
                  Blog Post
                </p>

                <h3 class="profile-post-title mb-3">
                  {{ post.title }}
                </h3>

                <p class="profile-post-excerpt mb-4">
                  {{ post.content }}
                </p>

                <div class="profile-post-footer">
                  <small class="text-secondary">
                    {{ formatDate(post.createdOn) }}
                  </small>

                  <button
                    class="btn btn-link btn-sm p-0 text-decoration-none"
                    @click="editPost(post._id)"
                  >
                    Edit Post
                  </button>
                </div>
              </div>
            </article>
          </div>

          <div class="col-12 col-md-6 col-lg-4">
            <button
              class="create-post-card w-100 h-100"
              type="button"
              @click="goToEditor"
            >
              <span class="create-post-icon">+</span>
              <span>Create New Post</span>
            </button>
          </div>
        </div>

        <div v-else class="empty-posts">
          <p class="mb-3">You have not created any posts yet.</p>

          <button class="btn btn-primary px-4" @click="goToEditor">
            Create Your First Post
          </button>
        </div>
      </section>
    </section>
  </main>
</template>

<style scoped>

.profile-page {
  min-height: 100vh;
}

.profile-name {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.profile-post-card {
  background-color: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius);
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.profile-post-card:hover {
  border-color: var(--app-primary);
  transform: translateY(-2px);
}

.profile-post-body {
  min-height: 260px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.profile-post-title {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.6rem;
}

.profile-post-excerpt {
  color: var(--app-muted);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.profile-post-footer {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--app-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.create-post-card {
  min-height: 260px;
  background-color: transparent;
  border: 1px dashed var(--app-border);
  border-radius: var(--app-radius);
  color: var(--app-muted);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
}

.create-post-card:hover {
  border-color: var(--app-primary);
  color: var(--app-primary);
}

.create-post-icon {
  width: 2rem;
  height: 2rem;
  border: 1px solid currentColor;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

.empty-posts {
  background-color: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius);
  padding: 2rem;
  text-align: center;
  color: var(--app-muted);
}

@media (max-width: 575.98px) {
  .profile-post-body {
    min-height: auto;
    padding: 1rem;
  }

  .profile-post-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>