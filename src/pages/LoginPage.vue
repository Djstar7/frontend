<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import type { UserLogin } from '@/types/user'
import { toastError, toastInfo, toastSuccess } from '@/utils/toastConfig'

const form = ref<UserLogin>({
  email: '',
  password: '',
})

const error = ref<string | null>(null)
const loading = ref<boolean>(false)

const userStore = useUserStore()

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = null

    toastInfo('Connexion en cours...')

    await userStore.login(form.value)
    toastSuccess('Connexion reussie')
  } catch (err: any) {
    error.value = err.response?.data?.message || ''
    toastError('Erreur lors de l’inscription')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <h2 class="text-3xl font-bold text-center text-purple-600 mb-6">Connexion</h2>
  <form @submit.prevent="handleLogin" class="space-y-4">
    <div>
      <label for="email" class="block text-md font-medium text-gray-700">Email</label>
      <input
        type="email"
        id="email"
        v-model="form.email"
        class="mt-1 block w-full px-4 text-xl py-2 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 md:text-md"
      />
    </div>
    <div>
      <label for="password" class="block text-md font-medium text-gray-700">Mot de passe</label>
      <input
        type="password"
        id="password"
        v-model="form.password"
        class="mt-1 block w-full px-4 text-xl py-2 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 md:text-md"
      />
    </div>
    <p class="w-full flex items-end justify-end">
      <router-link
        :to="{ name: 'auth.forgotpassword' }"
        class="text-purple-600 hover:text-orange-400"
      >
        Mot de passe oublie ?
      </router-link>
    </p>
    <div v-if="userStore.error" class="text-red-600 text-md mt-2">
      {{ userStore.error }}
    </div>
    <div>
      <button
        type="submit"
        :disabled="userStore.loading"
        class="w-full flex justify-center py-2 px-4 text-xl border border-transparent rounded-md shadow-md text-md font-medium text-white bg-indigo-600 hover:bg-orange-400 cursor-pointer"
      >
        <span :aria-disabled="userStore.loading">Se connecter</span>
      </button>
    </div>
  </form>
  <p class="mt-6 text-md text-gray-600">
    Pas encore de compte ?
    <router-link
      :to="{ name: 'auth.register' }"
      class="font-medium text-indigo-600 hover:text-orange-400"
    >
      S'inscrire
    </router-link>
  </p>
</template>
emplate>
