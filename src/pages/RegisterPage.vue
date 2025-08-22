<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import type { UserRegister } from '@/types/user'

interface FormRegister {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const form = ref<FormRegister>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const error = ref<string | null>(null)
const loading = ref<boolean>(false)

const userStore = useUserStore()

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  try {
    loading.value = true
    error.value = null

    const formRegister: UserRegister = {
      name: form.value.name,
      email: form.value.email, // ✅ corrigé
      password: form.value.password,
    }

    await userStore.register(formRegister)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erreur lors de l’inscription'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <h2 class="text-3xl font-bold text-center text-purple-600 mb-6">Inscription</h2>
  <form @submit.prevent="handleRegister" class="space-y-4">
    <div>
      <label for="name" class="block text-md font-medium text-gray-700">Nom</label>
      <input
        type="text"
        id="name"
        v-model="form.name"
        class="mt-1 block w-full text-xl px-4 py-2 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 md:text-md"
      />
    </div>
    <div>
      <label for="email" class="block text-md font-medium text-gray-700">Email</label>
      <input
        type="email"
        id="email"
        v-model="form.email"
        class="mt-1 block w-full text-xl px-4 py-2 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 md:text-md"
      />
    </div>
    <div>
      <label for="password" class="block text-md font-medium text-gray-700">Mot de passe</label>
      <input
        type="password"
        id="password"
        v-model="form.password"
        class="mt-1 block w-full text-xl px-4 py-2 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 md:text-md"
      />
    </div>
    <div>
      <label for="confirmPassword" class="block text-md font-medium text-gray-700"
        >Confirmer le mot de passe</label
      >
      <input
        type="password"
        id="confirmPassword"
        v-model="form.confirmPassword"
        class="mt-1 block w-full text-xl px-4 py-2 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 md:text-md"
      />
    </div>
    <div class="text-red-600 text-sm mt-2">
      {{ error }}
    </div>
    <div class="mt-6">
      <button
        type="submit"
        :disabled="loading"
        class="w-full text-xl flex justify-center cursor-pointer py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-indigo-600 hover:bg-orange-400"
      >
        <span v-if="loading">Chargement...</span>
        <span v-else>S'inscrire</span>
      </button>
    </div>
  </form>
  <p class="mt-6 text-md text-gray-600">
    Déjà un compte ?
    <router-link
      :to="{ name: 'auth.login' }"
      class="font-medium text-purple-500 hover:text-orange-400"
    >
      Se connecter
    </router-link>
  </p>
</template>
