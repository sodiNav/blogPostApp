<script setup>
  import { useGlobalStore } from "../stores/global";

  const { user } = useGlobalStore();
</script>

<template>
  <nav class="navbar navbar-expand-lg app-navbar sticky-top">
    <div class="container">
      <router-link class="navbar-brand fw-bold" :to="{name: 'Home'}">
        Think Out Loud
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
        aria-controls="mainNavbar"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="mainNavbar" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
          <router-link class="nav-link" :hidden="user.isAdmin" :to="{name: 'Home'}">Home</router-link>

          <router-link class="nav-link" v-if="user.email && !user.isAdmin" :to="{name: 'Profile'}">Profile</router-link>

          <router-link class="nav-link" v-else-if="user.email && user.isAdmin" :to="{name: 'AdminDashboard'}">Dashboard</router-link>

          <router-link class="btn btn-outline-primary btn-sm px-3" v-if="!user.email" :to="{name: 'Login'}">
            Login
          </router-link>

          <router-link class="btn btn-primary btn-sm px-3" v-if="!user.email" :to="{name: 'Register'}">
            Register
          </router-link>

          <router-link class="btn btn-primary btn-sm px-3" v-else :to="{name: 'Logout'}">
            Logout
          </router-link>
        </ul>

      </div>
    </div>
  </nav>
</template>