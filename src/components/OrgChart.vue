<template>
  <div class="org-chart">
    <div class="node root" :style="{ backgroundColor: getNodeColor(data) }">
      <div class="content">
        <div class="title">{{ data.name }}</div>
        <div v-if="data.count" class="count">{{ data.count }}</div>
      </div>
      <div class="icon">
        <v-icon>{{ getNodeIcon(data) }}</v-icon>
      </div>
    </div>
    
    <div v-if="data.children && data.children.length" class="children">
      <div class="vertical-line"></div>
      <div class="horizontal-container">
        <div 
          v-for="child in data.children" 
          :key="child.id"
          class="child-container"
        >
          <div class="horizontal-line"></div>
          <div class="node-container">
            <!-- Status Node -->
            <div class="node status" :style="{ backgroundColor: getNodeColor(child) }">
              <div class="content">
                <div class="title">{{ child.name }}</div>
                <div v-if="child.count" class="count">{{ child.count }}</div>
              </div>
              <div class="icon">
                <v-icon>{{ getNodeIcon(child) }}</v-icon>
              </div>
            </div>

            <!-- Client Nodes Container -->
            <div v-if="child.children && child.children.length" class="clients-container">
              <div class="vertical-line"></div>
              <div class="vertical-nodes-container">
                <div 
                  v-for="clientNode in child.children" 
                  :key="clientNode.id"
                  class="client-node-wrapper"
                >
                  <div class="horizontal-line-short"></div>
                  <div class="node client" :style="{ backgroundColor: getNodeColor(clientNode) }">
                    <div class="content">
                      <div class="title">{{ clientNode.name }}</div>
                      <div v-if="clientNode.client" class="details">
                        <v-chip size="small" class="mb-1">{{ clientNode.client.documentId }}</v-chip>
                        <v-chip size="small" class="mb-1">{{ clientNode.client.phone }}</v-chip>
                        <v-chip size="small">{{ clientNode.client.email }}</v-chip>
                      </div>
                    </div>
                    <div class="icon">
                      <v-icon>{{ getNodeIcon(clientNode) }}</v-icon>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ClientTreeNode } from '../types/client';

defineProps<{
  data: ClientTreeNode;
}>();

const getNodeIcon = (item: ClientTreeNode) => {
  if (item.id === 'root') return 'mdi-domain';
  if (item.id.startsWith('status')) return 'mdi-folder';
  return 'mdi-account';
};

const getNodeColor = (item: ClientTreeNode) => {
  if (item.id === 'root') return '#435f8c';
  if (item.id.startsWith('status')) {
    if (item.name.toLowerCase().includes('activo')) return '#4caf50';
    if (item.name.toLowerCase().includes('inactivo')) return '#ff9800';
    if (item.name.toLowerCase().includes('lista negra')) return '#000000';
    return '#2196f3';
  }
  return '#90a4ae';
};
</script>

<style scoped>
.org-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  width: 100%;
}

.node {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  color: white;
  min-width: 200px;
  margin: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.root {
  background-color: #435f8c;
  margin-bottom: 20px;
}

.content {
  flex: 1;
}

.title {
  font-weight: bold;
  margin-bottom: 4px;
}

.count {
  font-size: 0.9em;
  opacity: 0.9;
}

.details {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.icon {
  margin-left: 12px;
}

.children {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.vertical-line {
  width: 2px;
  height: 20px;
  background-color: #90a4ae;
}

.horizontal-container {
  display: flex;
  justify-content: center;
  gap: 40px;
  width: 100%;
}

.child-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.horizontal-line {
  width: 2px;
  height: 20px;
  background-color: #90a4ae;
}

.horizontal-line-short {
  width: 20px;
  height: 2px;
  background-color: #90a4ae;
  margin-right: -10px;
}

.node-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.clients-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.vertical-nodes-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.client-node-wrapper {
  display: flex;
  align-items: center;
}

.client {
  background-color: #90a4ae;
}

.status {
  background-color: #2196f3;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .horizontal-container {
    flex-direction: column;
    gap: 20px;
  }
  
  .node {
    min-width: 180px;
  }
}
</style>
