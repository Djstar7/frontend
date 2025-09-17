<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import type { UserRegister } from '@/types/user'
import { toastError, toastSuccess } from '@/utils/toastConfig'

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

const userStore = useUserStore()

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  try {
    userStore.loading = true
    userStore.error = null

    const formRegister: UserRegister = {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
    }

    const res = await userStore.register(formRegister)
    toastSuccess(res.message)
  } catch (err: any) {
    toastError(userStore.error || 'Erreur de la connexion')
  }
}
</script>

<template>
  <h2 class="text-3xl font-bold text-center text-purple-600 mb-6">Inscription</h2>
  <form @submit.prevent="handleRegister" class="space-y-4">
    <div>
      <label for="name" class="block text-md font-medium text-gray-700">Pseudo</label>
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
    <div>
      <button
        type="submit"
        :disabled="userStore.loading"
        class="w-full flex items-center justify-center gap-2 py-2 px-4 text-lg font-medium text-white rounded-xl shadow-md transition-colors duration-300 bg-indigo-600 hover:bg-orange-400 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <span v-if="userStore.loading" class="flex items-center gap-2">
          <i class="fas fa-spinner fa-spin"></i>
          Connexion...
        </span>
        <span v-else class="flex items-center gap-2">
          <i class="fas fa-sign-in-alt"></i>
          S'inscrire
        </span>
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
