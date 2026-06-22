<script setup>
    import { watch, ref, onBeforeMount } from 'vue';
    import { Notyf } from 'notyf';
    import { useRouter } from 'vue-router';
    import { useGlobalStore } from '../stores/global.js';
    import api from '../api.js';

    const username = ref("");
    const email = ref("");
    const password = ref("");
    const confirmPass = ref("");
    const isEnabled = ref(false);
    const isRegistering = ref(false);

    const notyf = new Notyf();

    const router = useRouter()

    const { user } = useGlobalStore();

    watch([username, email, password, confirmPass], (currentValue, oldValue) => {
        if(currentValue.every(input => input !== "") && currentValue[2] === currentValue[3]){
            isEnabled.value = true
        } else {
            isEnabled.value = false
        }

    });

    async function handleSubmit(){

        isRegistering.value = true;

        try {

            let response = await api.post('/users/register', {
                username: username.value,
                email: email.value,
                password: password.value
            })

            if(response.status === 201) {

                notyf.success(response.data.message);

                email.value = "";
                password.value = "";
                confirmPass.value = "";

                router.push({path: '/login'})

            } else {
                notyf.error("Registration Failed. Please contact administrator.");
            }

        } catch (e) {
            let message = e.response?.data?.message || "Registration Failed. Please contact administrator."
            notyf.error(message);
        }
        finally {
            isRegistering.value = false;
        }
    }

    onBeforeMount(() => {
        if(user.token){
            router.push({path: '/'})
        }
    })
</script>

<template>
  <main class="auth-page">
    <section class="container">
      <div class="row justify-content-center align-items-center min-vh-100 py-5">
        <div class="col-12 col-md-8 col-lg-5 col-xl-4">
          <div class="auth-card">
            <p class="section-label mb-2">Start Writing</p>

            <h1 class="page-title mb-3">Create your account</h1>

            <p class="text-secondary mb-4">
              Join the space for simple, focused blog publishing.
            </p>

            <form @submit.prevent="handleSubmit">
              <div class="mb-4">
                <label for="username" class="form-label">Username</label>
                <input
                  id="username"
                  v-model="username"
                  type="text"
                  class="form-control"
                  placeholder="Enter username"
                />
              </div>

              <div class="mb-4">
                <label for="email" class="form-label">Email</label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  class="form-control"
                  placeholder="Enter email"
                />
              </div>

              <div class="mb-4">
                <label for="password" class="form-label">Password</label>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  class="form-control"
                  placeholder="Enter password"
                />
              </div>

              <div class="mb-4">
                <label for="confirmPass" class="form-label">
                  Verify Password
                </label>
                <input
                  id="confirmPass"
                  v-model="confirmPass"
                  type="password"
                  class="form-control"
                  placeholder="Re-enter password"
                />
              </div>

              <button type="submit" class="btn btn-primary w-100 py-2" :disabled="!isEnabled">
                Register
              </button>
            </form>

            <p class="auth-switch text-center mt-4 mb-0">
              Already have an account?
              <router-link to="/login">Login here</router-link>
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>