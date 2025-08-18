<!-- src/layouts/AuthLayout.vue -->
<script setup lang="ts"></script>

<template>
  <div class="min-h-screen flex">
    <!-- Section gauche avec illustration -->
    <div
      class="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-red-500 items-center justify-center p-8"
    >
      <div class="text-center text-white max-w-lg">
        <img
          src="@/assets/images/logo.png"
          alt="Logo"
          class="h-30 w-30 mx-auto mb-6 drop-shadow-lg"
        />
        <h1 class="text-4xl font-bold mb-4">Service Immigration Estuaire</h1>
        <p class="text-lg opacity-90">
          Simplifiez vos démarches de voyage avec notre plateforme intuitive et rapide.
        </p>
      </div>
    </div>

    <!-- Section droite avec le contenu dynamique -->
    <div class="flex flex-1 flex-col justify-center items-center lg:w-1/2 bg-white">
      <router-view />
      <!-- Footer -->
      <footer class="mt-10 text-center text-gray-500 text-sm">
        &copy; 2025 Service Immigration Estuaire. Tous droits réservés.
      </footer>
    </div>
  </div>
</template>
