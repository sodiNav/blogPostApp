<script setup>
    import { onBeforeMount, reactive, ref } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import api from "../api";
    import { useGlobalStore } from '../stores/global';
    import { Notyf } from 'notyf';
    import CommentList from '../components/CommentsList.vue';
    import { formatDate } from '../utils/dateFormatter';

    const router = useRouter();
    const route = useRoute();
    const { user } = useGlobalStore();
    const notyf = new Notyf();
    const post = reactive({ data: {} });
    const commentsList = reactive({data:[]});
    const newComment = ref('');
    const isLoading = ref(false);

    
    const getComments = async () => {
        try {
            let { data } = await api.get(`/posts/getComments/${route.params.id}`);
            
            commentsList.data = data.comments || [];
        }
        catch(e) {
            let message = e.response?.data?.message || "There has been an error while retrieving comments"
            console.log(e)
            
            notyf.error(message);
        }
    }
    
    const addComment = async () => {
        isLoading.value = true;
        try {
            let res = await api.patch(`/posts/addComment/${route.params.id}`, {
                comment: newComment.value
            });
            
            if (res.status === 200) {
                notyf.success("Comment Added Successfully");
                
                newComment.value = '';
                
                getComments();
            }
            else {
                notyf.error(res.data.message)
            }
        }
        catch(e) {
            let message = e.response?.data?.message || "Adding comment failed. Please contact administrator"
            console.log(e)
            
            notyf.error(message);
        }
        finally{
            isLoading.value = false;
        }
    }

    onBeforeMount(async () => {
        let { data } = await api.get(`/posts/getPost/${route.params.id}`);
        post.data = data.post;

        getComments();
    });
</script>

<template>
  <main class="view-post-page">
    <section class="container py-5">
      <article class="post-reading-container">
        <RouterLink to="/" class="back-link mb-4 d-inline-block">
          ← Back to posts
        </RouterLink>

        <p class="section-label mb-3">
          {{ post.data.userId?.username || 'Unknown Author' }}
        </p>

        <h1 class="reading-title mb-3">
          {{ post.data.title }}
        </h1>

        <p class="text-secondary mb-5">
          Posted on {{ formatDate(post.data.createdOn) }}
        </p>

        <div class="reading-content">
          <p>
            {{ post.data.content }}
          </p>
        </div>
      </article>

      <section class="post-reading-container mt-5 pt-5 border-top">
        <CommentList :comments="commentsList.data" />

        <form class="comment-form mt-5" @submit.prevent="addComment">
          <h2 class="section-heading mb-4">Add a Comment</h2>

          <div class="mb-3">
            <label for="comment" class="form-label">Comment</label>
            <textarea
              id="comment"
              v-model="newComment"
              class="form-control"
              rows="4"
              placeholder="Write your comment"
            ></textarea>
          </div>

          <button type="submit" class="btn btn-primary px-4">
            Submit Comment
          </button>
        </form>
      </section>
    </section>
  </main>
</template>

<style scoped>
.view-post-page {
  background-color: var(--app-surface);
}

.post-reading-container {
  max-width: var(--app-reading-width);
  margin-inline: auto;
}

.back-link {
  color: var(--app-primary);
  font-weight: 600;
  text-decoration: none;
}

.back-link:hover {
  text-decoration: underline;
}

.reading-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.reading-content {
  font-family: 'Source Serif 4', serif;
  font-size: 1.25rem;
  line-height: 2rem;
  color: var(--app-text);
}

.comment-form {
  background-color: var(--app-bg);
  border: 1px solid var(--app-border);
  border-radius: var(--app-radius);
  padding: 1.5rem;
}

@media (max-width: 575.98px) {
  .comment-form {
    padding: 1rem;
  }

  .reading-content {
    font-size: 1.125rem;
    line-height: 1.875rem;
  }
}
</style>