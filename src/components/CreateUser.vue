<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { toastError, toastSuccess } from '@/utils/toastConfig'
import type { Custom } from '@/types/user'
import { reactive } from 'vue'
const userStore = useUserStore()
// Props destructurées
const emit = defineEmits<{
  (e: 'created'): void
}>()
const form = reactive<Custom>({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  role: 'custom',
  first_name: '',
  last_name: '',
  gender: 'male',
  date_of_birth: '',
  place_of_birth: '',
  status_mat: 'single',
  nationality: '',
})
const handleSubmit = async () => {
  try {
    if (form.role == 'custom') {
      await userStore.createCustom(form)
    } else {
      await userStore.createUser(form)
    }
    toastSuccess('Profil client créé avec succès ✅')
    emit('created')
  } catch (err: any) {
    toastError(userStore.error || 'Erreur lors de la création du profil w')
  }
}

// Classes réutilisables
const inputClass =
  'mt-1 w-full rounded-lg p-3 text-md border-gray-300 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 border'

const labelClass = 'block text-sm font-medium text-gray-700'
</script>

<template>
  <section class="flex items-center justify-center px-6">
    <div class="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">
      <!-- Titre -->
      <h1 class="text-3xl font-bold text-purple-600 flex items-center gap-2 mb-6">
        <i class="fas fa-user-plus text-orange-400"></i>
        Creation d'un nouveau client
      </h1>

      <!-- Formulaire -->
      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Name -->
        <div>
          <label :class="labelClass">Name</label>
          <input v-model="form.name" type="text" :class="inputClass" />
        </div>

        <!-- Email -->
        <div>
          <label :class="labelClass">Email</label>
          <input v-model="form.email" type="email" :class="inputClass" />
        </div>

        <!-- Role -->
        <div>
          <label :class="labelClass">Role</label>
          <select v-model="form.role" :class="inputClass">
            <option value="custom">Client</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
          </select>
        </div>

        <!-- Mot de passe -->
        <div>
          <label :class="labelClass">Mot de passe</label>
          <input v-model="form.password" type="password" :class="inputClass" />
        </div>

        <!-- Confirmer Mot de passe -->
        <div>
          <label :class="labelClass">Confirmez le mot de passe</label>
          <input v-model="form.password_confirmation" type="password" :class="inputClass" />
        </div>

        <!-- Nom -->
        <div v-if="form.role == 'custom'">
          <label :class="labelClass">Nom</label>
          <input v-model="form.last_name!" type="text" :class="inputClass" />
        </div>

        <!-- Prénom -->
        <div v-if="form.role == 'custom'">
          <label :class="labelClass">Prénom</label>
          <input v-model="form.first_name!" type="text" :class="inputClass" />
        </div>

        <!-- Téléphone -->
        <div v-if="form.role == 'custom'">
          <label :class="labelClass">Téléphone</label>
          <input v-model="form.phone!" type="tel" required :class="inputClass" />
        </div>

        <!-- Genre -->
        <div v-if="form.role == 'custom'">
          <label :class="labelClass">Genre</label>
          <select v-model="form.gender!" :class="inputClass">
            <option value="male">Homme</option>
            <option value="female">Femme</option>
          </select>
        </div>

        <!-- Date de naissance -->
        <div v-if="form.role == 'custom'">
          <label :class="labelClass">Date de naissance</label>
          <input v-model="form.date_of_birth!" type="date" :class="inputClass" />
        </div>

        <!-- Lieu de naissance -->
        <div v-if="form.role == 'custom'">
          <label :class="labelClass">Lieu de naissance</label>
          <input v-model="form.place_of_birth!" type="text" :class="inputClass" />
        </div>

        <!-- Statut matrimonial -->
        <div v-if="form.role == 'custom'">
          <label :class="labelClass">Statut matrimonial</label>
          <select v-model="form.status_mat!" :class="inputClass">
            <option value="single">Célibataire</option>
            <option value="married">Marié(e)</option>
            <option value="divorced">Divorcé(e)</option>
            <option value="widowed">Veuf/Veuve</option>
          </select>
        </div>

        <!-- Pays -->
        <div v-if="form.role == 'custom'">
          <label :class="labelClass">Pays</label>
          <input v-model="form.nationality!" type="text" :class="inputClass" />
        </div>

        <!-- Bouton -->
        <div class="col-span-2 mt-8">
          <button
            type="submit"
            :disabled="userStore.loading"
            class="w-full flex items-center justify-center gap-2 py-3 px-4 text-lg font-medium text-white rounded-xl shadow-md transition-colors duration-300 bg-indigo-600 hover:bg-orange-400 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <i v-if="userStore.loading" class="fas fa-spinner fa-spin"></i>
            <i class="fas fa-user-plus"></i>
            <span>{{ userStore.loading ? 'Creation...' : "Creation de l'utilisateur" }}</span>
          </button>
        </div>
      </form>

      <!-- Erreur -->
      <div v-if="userStore.error" class="text-red-600 text-md mt-4 text-center">
        {{ userStore.error }}
      </div>
    </div>
  </section>
</template>
