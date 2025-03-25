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
                        <v-chip size="small" class="mb-1">CC. {{ clientNode.client.documentId }}</v-chip>
                        <v-chip size="small" class="mb-1">Tel. {{ clientNode.client.phone }}</v-chip>
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

const props = defineProps<{
  data: ClientTreeNode;
}>();

const getNodeIcon = (item: ClientTreeNode) => {
  if (item.id === 'root') return 'mdi-domain';
  if (item.id.startsWith('status')) return 'mdi-folder';
  return 'mdi-account';
};

const getNodeColor = (item: ClientTreeNode) => {
  // Root node color (JMC)
  if (item.id === 'root') return '#435f8c';

  // Get node status (either directly or from parent)
  let statusName = '';
  
  // If this is a status node, use its name
  if (item.id.startsWith('status-')) {
    statusName = item.name.toLowerCase();
  } 
  // If this is a client node, find its parent status node
  else if (item.id.startsWith('client-')) {
    // Find the status node that contains this client
    const parentStatus = props.data.children?.find(
      (status: ClientTreeNode) => status.children?.some(
        (client: ClientTreeNode) => client.id === item.id
      )
    );
    if (parentStatus) {
      statusName = parentStatus.name.toLowerCase();
    }
  }

  // Return color based on status name
  if (statusName.includes('activo')) return '#4caf50';      // Green
  if (statusName.includes('inactivo')) return '#808080';    // Grey
  if (statusName.includes('lista negra')) return '#000000'; // Black
  
  // Default white for other cases
  return '#ffffff';
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
  color: white;
  min-width: 200px;
  margin: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  border: 1px solid #ddd;
}

.node[style*="background-color: #ffffff"] {
  color: #000;
}

.root, .status {
  border-radius: 50%;
  width: 120px;
  height: 120px;
  min-width: unset;
  justify-content: center;
  flex-direction: column;
  text-align: center;
  padding: 16px;
}

.root .content, .status .content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.root .icon, .status .icon {
  margin-left: 0;
  margin-top: 8px;
}

.client {
  border-radius: 8px;
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
