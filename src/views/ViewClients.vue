<template>
  <v-layout>
    <AppHeader />
    <v-main class="pa-6">
      <v-card>
        <v-card-title class="text-h5 pa-4">
          View Clients by Status
        </v-card-title>
        <v-card-text>
          <v-btn
            color="primary"
            @click="loadData"
            :loading="loading"
            class="mb-4"
          >
            Load Data
          </v-btn>

          <div v-if="error" class="text-error mb-4">
            {{ error }}
          </div>

          <v-treeview
            v-if="showTree"
            :items="clientTree"
            item-children="children"
            item-text="name"
            dense
            rounded
            hoverable
            activatable
            open-all
          >
            <template v-slot:prepend="{ item }">
              <v-icon v-if="!item.client">
                {{ getNodeIcon(item) }}
              </v-icon>
            </template>

            <template v-slot:append="{ item }">
              <div v-if="item.client" class="d-flex align-center">
                <v-chip size="small" class="mr-2">{{ item.client.documentId }}</v-chip>
                <v-chip size="small" class="mr-2">{{ item.client.phone }}</v-chip>
                <v-chip size="small">{{ item.client.email }}</v-chip>
              </div>
              <v-chip
                v-else-if="item.count !== undefined"
                color="primary"
                size="small"
              >
                {{ item.count }}
              </v-chip>
            </template>
          </v-treeview>
        </v-card-text>
      </v-card>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useClientStore } from '../stores/client';
import AppHeader from '../components/AppHeader.vue';

const clientStore = useClientStore();
const loading = ref(false);
const error = ref('');
const showTree = ref(false);

const clientTree = computed(() => clientStore.buildClientTree);

const getNodeIcon = (item: any) => {
  if (item.id === 'root') return 'mdi-domain';
  if (item.id.startsWith('status')) return 'mdi-folder';
  return 'mdi-account';
};

const loadData = async () => {
  loading.value = true;
  error.value = '';
  showTree.value = false;

  try {
    const statuses = await clientStore.fetchStatuses();
    
    // Fetch clients for each status
    await Promise.all(
      statuses.map(status => clientStore.fetchClientsByStatus(status.id))
    );

    showTree.value = true;
  } catch (err: any) {
    error.value = err.message || 'Failed to load client data';
  } finally {
    loading.value = false;
  }
};
</script>