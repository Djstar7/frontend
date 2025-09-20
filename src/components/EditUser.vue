<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'
import { toastError, toastSuccess } from '@/utils/toastConfig'
import type { Custom } from '@/types/user'
const userStore = useUserStore()
// Props destructurées
const { form, id } = defineProps<{ form: Custom; id?: number }>()
const emit = defineEmits<{
  (e: 'updated'): void
}>()
const handleSubmit = async () => {
  try {
    // Si le store n'a pas encore l'utilisateur, charger depuis localStorage
    if (!userStore.user) userStore.loadUserFromLocalStorage()
    if (!userStore.user) throw new Error('Aucun utilisateur trouvé')

    if (form.role == 'custom') {
      await userStore.editCustom(id!, form)
    } else {
      await userStore.editUser(id!, form)
    }
    toastSuccess('Profil client créé avec succès ✅')
    emit('updated')
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
        <i class="fas fa-user-edit text-orange-400"></i>
        Mise a jour du profil
      </h1>

      <!-- Formulaire -->
      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Name -->
        <div>
          <label :class="labelClass">Name</label>
          <input v-model="form.name!" type="text" :class="inputClass" />
        </div>

        <!-- Email -->
        <div>
          <label :class="labelClass">Email</label>
          <input v-model="form.email!" type="text" :class="inputClass" />
        </div>

        <!-- Role -->
        <div>
          <label :class="labelClass">Role</label>
          <select v-model="form.role!" :class="inputClass">
            <option value="custom">Client</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
          </select>
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
            <i class="fas fa-user-edit"></i>
            <span>{{ userStore.loading ? 'Mise a jour...' : 'Mettre a jour le profil' }}</span>
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
