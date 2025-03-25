<template>
  <v-app-bar color="primary">
    <v-app-bar-title>
      <router-link to="/main" class="text-white text-decoration-none">
        JMC Client Manager
      </router-link>
    </v-app-bar-title>
    <v-spacer></v-spacer>
    <v-btn
      v-if="currentRoute !== '/main'"
      to="/main"
      text
      color="white"
    >
      Main Page
    </v-btn>
    <v-btn
      @click="handleLogout"
      text
      color="error"
    >
      Logout
    </v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const currentRoute = computed(() => route.path);

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>