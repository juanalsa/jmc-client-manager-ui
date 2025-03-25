<template>
  <div>
    <AppHeader />
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Create Status</h2>
        
        <div v-if="successMessage" class="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
          {{ successMessage }}
        </div>

        <Form @submit="handleSubmit" :validation-schema="schema" v-slot="{ errors }">
          <div class="space-y-6">
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <Field
                name="description"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                :class="{ 'border-red-500': errors.description }"
              />
              <ErrorMessage name="description" class="text-red-500 text-sm mt-1" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Esta Activo?
              </label>
              <div class="mt-2 space-x-4">
                <label class="inline-flex items-center">
                  <Field
                    name="isActive"
                    type="radio"
                    value="true"
                    class="form-radio text-indigo-600"
                  />
                  <span class="ml-2">Si</span>
                </label>
                <label class="inline-flex items-center">
                  <Field
                    name="isActive"
                    type="radio"
                    value="false"
                    class="form-radio text-indigo-600"
                  />
                  <span class="ml-2">No</span>
                </label>
              </div>
              <ErrorMessage name="isActive" class="text-red-500 text-sm mt-1" />
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
import { ref } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useClientStore } from '../stores/client';
import AppHeader from '../components/AppHeader.vue';

const clientStore = useClientStore();
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const schema = yup.object({
  description: yup.string().required('Description is required'),
  isActive: yup
    .boolean()
    .required('Active status is required')
    .transform((value) => value === 'true')
});

const handleSubmit = async (values: any) => {
  try {
    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';
    
    await clientStore.createStatus({
      description: values.description,
      isActive: values.isActive === 'true'
    });
    
    successMessage.value = 'Status created successfully';
    // Reset form
    values = {
      description: '',
      isActive: ''
    };
  } catch (error: any) {
    const response = error.response?.data;
    if (response?.errors) {
      errorMessage.value = Object.entries(response.errors)
        .map(([key, messages]) => `${key}: ${messages.join(', ')}`)
        .join('\n');
    } else {
      errorMessage.value = response?.message || 'An error occurred while creating the status';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>