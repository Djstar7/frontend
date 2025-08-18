<script setup lang="ts">
import type { UserLogin } from '@/types/user'
import { ref } from 'vue'

const formLogin = ref<UserLogin>({
  email: '',
  password: '',
})

const handleLogin = () => {
  console.log('Connexion avec:', formLogin.value)
}
</script>

<template>
  <!-- Conteneur principal qui prend toute la taille disponible -->
  <div class="w-full h-full flex items-center justify-center">
    <!-- Formulaire centré -->
    <div
      class="w-full max-w-md bg-white rounded-lg shadow-lg p-8 h-full lg:h-auto flex flex-col justify-center"
    >
      <!-- Logo -->
      <div class="flex justify-center items-center mb-6">
        <img src="@/assets/images/logo.png" alt="Logo" class="h-20 w-20 object-contain" />
      </div>

      <!-- Titre -->
      <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Connexion</h2>

      <!-- Formulaire -->
      <form @submit.prevent="handleLogin" class="space-y-4 w-full">
        <div>
          <label for="email" class="block text-gray-700 font-medium">Email</label>
          <input
            type="email"
            id="email"
            v-model="formLogin.email"
            placeholder="jeandupont@gmail.com"
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>
        <div>
          <label for="password" class="block text-gray-700 font-medium">Mot de passe</label>
          <input
            type="password"
            id="password"
            v-model="formLogin.password"
            placeholder="••••••••"
            class="mt-1 w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Se connecter
        </button>
      </form>

      <!-- Lien inscription -->
      <p class="mt-6 text-center text-gray-600">
        Pas de compte ?
        <router-link to="/register" class="text-purple-600 hover:text-red-500 font-semibold">
          Inscrivez-vous
        </router-link>
      </p>
    </div>
  </div>
</template>
