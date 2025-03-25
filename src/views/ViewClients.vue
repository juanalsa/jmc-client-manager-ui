<template>
  <div>
    <AppHeader />
    <main class="main-content">
      <v-container fluid class="pa-6">
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

            <div v-if="showDebug" class="debug-container mb-4">
              <div class="debug-content">
                <pre>Tree Data: {{ JSON.stringify(clientTree, null, 2) }}</pre>
              </div>
            </div>

            <div class="chart-container">
              <OrgChart
                v-if="showTree && clientTree.length > 0"
                :data="clientTree[0]"
              />

              <div v-else-if="showTree && clientTree.length === 0" class="text-subtitle-1 text-center mt-4">
                No client data available
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-container>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useClientStore } from '../stores/client';
import AppHeader from '../components/AppHeader.vue';
import OrgChart from '../components/OrgChart.vue';

const clientStore = useClientStore();
const loading = ref(false);
const error = ref('');
const showTree = ref(false);
const showDebug = ref(false);

const clientTree = computed(() => {
  const tree = clientStore.buildClientTree;
  console.log('Tree data:', tree);
  return tree;
});

const loadData = async () => {
  loading.value = true;
  error.value = '';
  showTree.value = false;

  try {
    const statuses = await clientStore.fetchStatuses();
    console.log('Fetched statuses:', statuses);
    
    await Promise.all(
      statuses.map(status => clientStore.fetchClientsByStatus(status.id))
    );

    showTree.value = true;
    console.log('Tree data after load:', clientTree.value);
  } catch (err: any) {
    error.value = err.message || 'Failed to load client data';
    showTree.value = false;
  } finally {
    loading.value = false;
  }
};

showDebug.value = false;
</script>

<style scoped>
.main-content {
  padding-top: 64px; /* Height of the AppHeader */
  min-height: calc(100vh - 64px);
}

.debug-container {
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #f5f5f5;
  margin: 8px 0;
  max-height: 300px;
  overflow: auto;
}

.debug-content {
  padding: 16px;
}

.chart-container {
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  max-width: 100%;
}

/* Ensure proper spacing on mobile */
@media (max-width: 600px) {
  .main-content {
    padding-top: 56px; /* Mobile header height */
  }
  
  .v-container {
    padding: 8px !important;
  }
}
</style>