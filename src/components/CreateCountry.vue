<script setup lang="ts">
import { reactive } from 'vue'
import { useCountryStore } from '@/stores/countryStore'
import { toastError, toastSuccess } from '@/utils/toastConfig'
import type { Country } from '@/types/country'

const countryStore = useCountryStore()

// Initialisation du formulaire pour un pays
const form = reactive<Country>({
  name: '',
  iso_code: '',
  phone_code: '',
})
const emit = defineEmits<{ (e: 'create'): void }>()

const handleSubmit = async () => {
  try {
    await countryStore.createCountry(form)
    emit('create')
    toastSuccess('Pays créé avec succès')

    // Réinitialisation du formulaire
    form.name = ''
    form.iso_code = ''
    form.phone_code = ''
  } catch (err: any) {
    toastError(countryStore.error || err.message || 'Erreur lors de la création du pays')
  }
}
</script>

<template>
  <section class="bg-gray-50 py-12 w-full px-6">
    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <!-- Titre -->
      <h1 class="text-3xl font-bold text-indigo-700 flex items-center gap-2 mb-6">
        <i class="fas fa-flag text-orange-400"></i>
        Ajouter un pays
      </h1>

      <!-- Formulaire -->
      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Nom du pays -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Nom du pays</label>
          <input
            v-model="form.name"
            type="text"
            required
            :disabled="countryStore.loading"
            class="mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border"
          />
        </div>

        <!-- Code ISO -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Code ISO</label>
          <input
            v-model="form.iso_code"
            type="text"
            required
            :disabled="countryStore.loading"
            class="mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border"
          />
        </div>

        <!-- Indicatif téléphonique -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Indicatif téléphonique</label>
          <input
            v-model="form.phone_code"
            type="text"
            required
            :disabled="countryStore.loading"
            class="mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border"
          />
        </div>

        <!-- Erreur éventuelle -->
        <div v-if="countryStore.error" class="text-red-600 text-md mt-2 col-span-full">
          {{ countryStore.error }}
        </div>

        <!-- Bouton -->
        <div class="mt-4 col-span-full">
          <button
            type="submit"
            :disabled="countryStore.loading"
            class="w-full flex items-center justify-center gap-2 py-3 px-4 text-lg font-medium text-white rounded-xl shadow-md transition-colors duration-300 bg-indigo-600 hover:bg-orange-400 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <i v-if="countryStore.loading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-flag"></i>
            <span>{{ countryStore.loading ? 'Création...' : 'Créer le pays' }}</span>
          </button>
        </div>
      </form>
    </div>
  </section>
</template>
