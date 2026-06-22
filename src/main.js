import './assets/main.css'

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons.min.css';

import 'notyf/notyf.min.css';

import { createApp } from 'vue'
import App from './App.vue'

import { createPinia } from 'pinia'; 

import HomePage from './pages/Home.vue';
import LoginPage from './pages/Login.vue';
import RegisterPage from './pages/Register.vue';
import LogoutPage from './pages/Logout.vue';
import ErrorPage from './pages/Error.vue';
import ProfilePage from './pages/Profile.vue';
import ViewPostPage from './pages/ViewPost.vue';
import PostEditorPage from './pages/PostEditor.vue';
import AdminDashboard from './adminPages/AdminDashboard.vue';
// import AddMoviePage from './adminPages/AddMovie.vue';
// import EditMoviePage from './adminPages/EditMovie.vue';

import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({

    history: createWebHistory(),

    routes: [
        {
            path: '/posts',
            name: 'Home',
            component: HomePage,
            alias: '/'
        },
        {
            path: '/register',
            name: 'Register',
            component: RegisterPage
        },
        {
            path: '/login',
            name: 'Login',
            component: LoginPage
        },
        {
            path: '/logout',
            name: 'Logout',
            component: LogoutPage
        },
        {
            path: '/profile',
            name: 'Profile',
            component: ProfilePage
        },
        {
            path: '/posts/:id',
            name: 'ViewPost',
            component: ViewPostPage
        },
        {
            path: '/posts/create',
            name: 'CreatePost',
            component: PostEditorPage
        },
        {
            path: '/posts/edit/:id',
            name: 'EditPost',
            component: PostEditorPage
        },
        {
            path: '/posts',
            name: 'AdminDashboard',
            component: AdminDashboard
        },
        {
            path: '/:catchAll(.*)',
            name: 'NotFound',
            component: ErrorPage
        }
    ]
})

const app = createApp(App);

app.use(createPinia());

app.use(router);
app.mount('#app');