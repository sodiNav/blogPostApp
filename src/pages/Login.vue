<script setup>
    import { watch, ref, onBeforeMount } from 'vue';
    import { Notyf } from 'notyf';
    import { useRouter } from 'vue-router';
    import { useGlobalStore } from '../stores/global';
    import api from '../api';

    const notyf = new Notyf();

  	const router = useRouter()

	const { getUserDetails, user } = useGlobalStore();

    const userCred = ref("");
    const password = ref("");
    const isEnabled = ref(false);
    const loading = ref(false);
    const showPassword = ref(false);
    // const isLoggingIn = ref(false);

    watch([userCred,password], (currentValue, oldValue) => {
        if(currentValue.every(input => input !== "")){
            isEnabled.value = true
        } else {
            isEnabled.value = false
        }
    });

    async function handleSubmit(){

        // isLoggingIn.value = true;

        try {

            let res = await api.post('/users/login', {
                userCred: userCred.value,
                password: password.value
            })

            console.log(res.data)

            if(res.data){
                
                notyf.success("Login Successful");

                localStorage.setItem("token",res.data.access);

                await getUserDetails(res.data.access);

                userCred.value = "";
                password.value = "";

                if(user.isAdmin){
                    router.push({name: 'AdminDashboard'});
                    return;
                }

		        router.push({path: '/posts'})
			}

        } catch(e) {

            let message = e.response?.data?.message || "Login Failed. Please contact administrator."
            console.log(e)

            notyf.error(message);
        }
        // finally {
        //     isLoggingIn.value = false;
        // }
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
            <p class="section-label mb-2">Welcome Back</p>

            <h1 class="page-title mb-3">Login to your account</h1>

            <p class="text-secondary mb-4">
              Continue writing, reading, and managing your blog posts.
            </p>

            <form @submit.prevent="handleSubmit">
              <div class="mb-4">
                <label for="userCred" class="form-label">
                  Username or Email
                </label>
                <input
                  id="userCred"
                  v-model="userCred"
                  type="text"
                  class="form-control"
                  placeholder="Enter username or email"
                />
              </div>

              <div class="mb-4">
                <label for="password" class="form-label">
                  Password
                </label>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  class="form-control"
                  placeholder="Enter password"
                />
              </div>

              <button type="submit" class="btn btn-primary w-100 py-2" :disabled="!isEnabled">
                Login
              </button>
            </form>

            <p class="auth-switch text-center mt-4 mb-0">
              Don’t have an account?
              <router-link to="/register">Create one</router-link>
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>