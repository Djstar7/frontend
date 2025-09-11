<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import type { UserLogin } from '@/types/user'
import { toastError, toastSuccess } from '@/utils/toastConfig'

const form = ref<UserLogin>({
  email: '',
  password: '',
})

const userStore = useUserStore()

const handleLogin = async () => {
  try {
    const res = await userStore.login(form.value)
    toastSuccess(res.message)
  } catch (err: any) {
    toastError(userStore.error || 'Erreur lors de la connexion')
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
        class="w-full flex items-center justify-center gap-2 py-2 px-4 text-lg font-medium text-white rounded-xl shadow-md transition-colors duration-300 bg-indigo-600 hover:bg-orange-400 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <span v-if="userStore.loading" class="flex items-center gap-2">
          <i class="fas fa-spinner fa-spin"></i>
          Connexion...
        </span>
        <span v-else class="flex items-center gap-2">
          <i class="fas fa-sign-in-alt"></i>
          Se connecter
        </span>
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
