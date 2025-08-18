<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-20">
      <!-- Logo -->
      <div class="flex items-center space-x-2">
        <img src="@/assets/images/logo.png" alt="Logo" class="h-20 w-20" />
      </div>

      <!-- Menu Desktop -->
      <nav class="hidden md:flex space-x-6 items-center">
        <a href="#" class="text-gray-800 hover:text-blue-600 transition-colors">Accueil</a>
        <a href="#" class="text-gray-800 hover:text-purple-600 transition-colors">Services</a>
        <a href="#" class="text-gray-800 hover:text-orange-500 transition-colors">Suivi Visa</a>
        <a href="#" class="text-gray-800 hover:text-red-500 transition-colors">Contact</a>
        <button
          class="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Connexion
        </button>
      </nav>

      <!-- Menu Mobile Button -->
      <div class="md:hidden">
        <button @click="open = !open" class="focus:outline-none">
          <svg
            v-if="!open"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-gray-800"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-show="open" class="md:hidden bg-white border-t border-gray-200">
      <a href="#" class="block px-4 py-2 text-gray-800 hover:text-blue-600 transition-colors"
        >Accueil</a
      >
      <a href="#" class="block px-4 py-2 text-gray-800 hover:text-purple-600 transition-colors"
        >Services</a
      >
      <a href="#" class="block px-4 py-2 text-gray-800 hover:text-orange-500 transition-colors"
        >Suivi Visa</a
      >
      <a href="#" class="block px-4 py-2 text-gray-800 hover:text-red-500 transition-colors"
        >Contact</a
      >
      <button
        class="w-full px-4 py-2 mt-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Connexion
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref<boolean>(false)
</script>

<style scoped>
/* Tu peux ajouter des animations si tu veux */
</style>
