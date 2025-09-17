<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { toastError, toastSuccess } from '@/utils/toastConfig'
import type { Profil } from '@/types/user'

const userStore = useUserStore()

const form = ref<Profil>({
  phone: '',
  first_name: '',
  last_name: '',
  gender: 'male',
  date_of_birth: '',
  place_of_birth: '',
  status_mat: 'single',
  nationality: '',
})
const emit = defineEmits<{
  (e: 'created'): void
}>()

const handleSubmit = async () => {
  try {
    if (!userStore.user) userStore.loadUserFromLocalStorage()
    if (!userStore.user) throw new Error('Aucun utilisateur trouvé')

    const { id } = userStore.user

    await userStore.editProfil(id!, form.value)
    emit('created')
    toastSuccess('Profil client créé avec succès')
  } catch (err: any) {
    toastError(userStore.error || 'Erreur lors de la création du profil')
  }
}
</script>

<template>
  <section class="bg-gray-50 py-12 w-full px-6">
    <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <!-- Titre -->
      <h1 class="text-3xl font-bold text-indigo-700 flex items-center gap-2 mb-6">
        <i class="fas fa-user-plus text-orange-400"></i>
        Créer un profil client
      </h1>

      <!-- Formulaire -->
      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Nom -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Nom</label>
          <input
            v-model="form.last_name"
            type="text"
            class="mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border"
          />
        </div>

        <!-- Prénom -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Prénom</label>
          <input
            v-model="form.first_name"
            type="text"
            class="mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border"
          />
        </div>

        <!-- Téléphone -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Téléphone</label>
          <input
            v-model="form.phone"
            type="tel"
            required
            class="mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border"
          />
        </div>

        <!-- Genre -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Genre</label>
          <select
            v-model="form.gender"
            class="mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border"
          >
            <option value="male">Homme</option>
            <option value="female">Femme</option>
          </select>
        </div>

        <!-- Date de naissance -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Date de naissance</label>
          <input
            v-model="form.date_of_birth"
            type="date"
            class="mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border"
          />
        </div>

        <!-- Lieu de naissance -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Lieu de naissance</label>
          <input
            v-model="form.place_of_birth"
            type="text"
            class="mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border"
          />
        </div>

        <!-- Statut matrimonial -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Statut matrimonial</label>
          <select
            v-model="form.status_mat"
            class="mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border"
          >
            <option value="single">Célibataire</option>
            <option value="married">Marié(e)</option>
            <option value="divorced">Divorcé(e)</option>
            <option value="widowed">Veuf/Veuve</option>
          </select>
        </div>

        <!-- Pays -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Pays</label>
          <input
            v-model="form.nationality"
            type="text"
            class="mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border"
          />
        </div>
      </form>
      <div v-if="userStore.error" class="text-red-600 text-md mt-2">
        {{ userStore.error }}
      </div>

      <!-- Bouton -->
      <div class="mt-8">
        <button
          type="submit"
          :disabled="userStore.loading"
          @click="handleSubmit"
          class="w-full flex items-center justify-center gap-2 py-3 px-4 text-lg font-medium text-white rounded-xl shadow-md transition-colors duration-300 bg-indigo-600 hover:bg-orange-400 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <i v-if="userStore.loading" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-user-plus"></i>
          <span>{{ userStore.loading ? 'Création...' : 'Créer le profil' }}</span>
        </button>
      </div>
    </div>
  </section>
</template>
