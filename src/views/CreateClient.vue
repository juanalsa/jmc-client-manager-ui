<template>
  <div>
    <AppHeader />
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Create Client</h2>
        
        <div v-if="successMessage" class="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
          {{ successMessage }}
        </div>

        <Form @submit="handleSubmit" :validation-schema="schema" v-slot="{ errors, resetForm }">
          <div class="space-y-6">
            <div>
              <label for="fullName" class="block text-sm font-medium text-gray-700">
                Nombre Completo
              </label>
              <Field
                name="fullName"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                :class="{ 'border-red-500': errors.fullName }"
              />
              <ErrorMessage name="fullName" class="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label for="documentId" class="block text-sm font-medium text-gray-700">
                Cédula
              </label>
              <Field
                name="documentId"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                :class="{ 'border-red-500': errors.documentId }"
              />
              <ErrorMessage name="documentId" class="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">
                Celular
              </label>
              <Field
                name="phone"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                :class="{ 'border-red-500': errors.phone }"
              />
              <ErrorMessage name="phone" class="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Correo
              </label>
              <Field
                name="email"
                type="email"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                :class="{ 'border-red-500': errors.email }"
              />
              <ErrorMessage name="email" class="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label for="statusId" class="block text-sm font-medium text-gray-700">
                Estado
              </label>
              <Field
                name="statusId"
                as="select"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                :class="{ 'border-red-500': errors.statusId }"
              >
                <option value="">Select a status</option>
                <option
                  v-for="status in statuses"
                  :key="status.id"
                  :value="status.id"
                >
                  {{ status.description }}
                </option>
              </Field>
              <ErrorMessage name="statusId" class="text-red-500 text-sm mt-1" />
            </div>

            <div v-if="errorMessage" class="text-red-500 text-sm">
              {{ errorMessage }}
            </div>

            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </Form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useClientStore } from '../stores/client';
import type { ClientStatus } from '../types/client';
import AppHeader from '../components/AppHeader.vue';

const clientStore = useClientStore();
const statuses = ref<ClientStatus[]>([]);
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const schema = yup.object({
  fullName: yup.string().required('Full name is required'),
  documentId: yup
    .string()
    .required('Document ID is required')
    .min(7, 'Document ID must be at least 7 characters')
    .matches(/^\d+$/, 'Document ID must be numeric'),
  phone: yup
    .string()
    .required('Phone is required')
    .min(10, 'Phone must be at least 10 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Must be a valid email'),
  statusId: yup
    .number()
    .required('Status is required')
    .positive('Status must be a positive integer')
});

onMounted(async () => {
  try {
    statuses.value = await clientStore.fetchStatuses();
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Failed to load statuses';
  }
});

const handleSubmit = async (values: any, { resetForm }: any) => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';
    
    await clientStore.createClient({
      ...values,
      statusId: Number(values.statusId)
    });
    
    successMessage.value = 'Client created successfully';
    resetForm();
  } catch (error: any) {
    const response = error.response?.data;
    if (response?.errors) {
      errorMessage.value = Object.entries(response.errors)
        .map(([key, messages]) => `${key}: ${messages.join(', ')}`)
        .join('\n');
    } else {
      errorMessage.value = response?.message || 'An error occurred while creating the client';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>