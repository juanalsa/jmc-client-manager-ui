<template>
  <v-layout class="fill-height">
    <v-app-bar color="primary">
      <v-app-bar-title class="text-white">JMC Client Manager</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn
        color="error"
        @click="handleLogout"
        prepend-icon="mdi-logout"
      >
        Logout
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container class="fill-height">
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-card>
              <v-card-text>
                <v-row justify="center" class="pa-4">
                  <v-col v-for="(option, index) in options" :key="index" cols="12" sm="4">
                    <v-card
                      :to="option.route"
                      class="text-center pa-4 elevation-3 h-100"
                      hover
                    >
                      <v-icon :icon="option.icon" size="64" color="primary" class="mb-4"/>
                      <v-card-title class="text-center">{{ option.title }}</v-card-title>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <v-bottom-navigation>
      <v-btn
        v-for="(option, index) in options"
        :key="index"
        :to="option.route"
        :value="option.route"
      >
        <v-icon>{{ option.icon }}</v-icon>
        {{ option.title }}
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const options = [
  {
    title: 'View Clients',
    route: '/view-clients',
    icon: 'mdi-chart-bar'
  },
  {
    title: 'Create Client',
    route: '/create-client',
    icon: 'mdi-account-plus'
  },
  {
    title: 'Create Status',
    route: '/create-status',
    icon: 'mdi-tag-plus'
  }
];

const handleLogout = () => {
  authStore.logout();
  router.push('/');
};
</script>