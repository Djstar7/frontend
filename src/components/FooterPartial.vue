<!-- src/components/Footer.vue -->
<template>
  <footer class="bg-gray-200 text-gray-500 py-12">
    <div class="mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
      <!-- Logo + présentation -->
      <div>
        <h2 class="text-2xl font-bold text-black mb-4">Service Immigration de l'Estuaire</h2>
        <p class="text-md leading-relaxed">
          Nous simplifions vos démarches de visa en centralisant : documents requis, téléversement
          sécurisé, suivi en temps réel et notifications personnalisées.
        </p>
        <div class="flex space-x-4 mt-4">
          <a href="#" class="hover:text-blue-500 text-2xl"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="hover:text-sky-400 text-2xl"><i class="fab fa-twitter"></i></a>
          <a href="#" class="hover:text-pink-500 text-2xl"><i class="fab fa-instagram"></i></a>
          <a href="#" class="hover:text-blue-600 text-2xl"><i class="fab fa-linkedin-in"></i></a>
        </div>
      </div>

      <!-- Liens utiles -->
      <div>
        <h3 class="text-black font-semibold mb-4 text-xl">Liens utiles</h3>
        <ul class="space-y-2 text-md">
          <li>
            <router-link :to="{ name: 'home' }" class="hover:text-black"
              ><i class="fas fa-home mr-2 text-blue-500"></i>Accueil</router-link
            >
          </li>
          <li>
            <router-link :to="{ name: 'about' }" class="hover:text-black"
              ><i class="fas fa-info-circle mr-2 text-purple-600"></i>À propos</router-link
            >
          </li>
          <li>
            <router-link :to="{ name: 'home' }" class="hover:text-black"
              ><i class="fas fa-briefcase mr-2 text-orange-400"></i>Nos services</router-link
            >
          </li>
          <li>
            <router-link :to="{ name: 'contact' }" class="hover:text-black"
              ><i class="fas fa-envelope mr-2 text-red-500"></i>Contact</router-link
            >
          </li>
        </ul>
      </div>

      <!-- Services -->
      <div>
        <h3 class="text-black font-semibold mb-4 text-xl">Fonctionnalités</h3>
        <ul class="space-y-2 text-md">
          <li><i class="fas fa-file-alt mr-2 text-blue-500"></i> Liste dynamique des documents</li>
          <li>
            <i class="fas fa-cloud-upload-alt mr-2 text-purple-600"></i> Téléversement sécurisé
          </li>
          <li>
            <i class="fas fa-bell mr-2 text-orange-400"></i> Suivi & notifications en temps réel
          </li>
          <li><i class="fas fa-calendar-check mr-2 text-green-500"></i> Prise de rendez-vous</li>
        </ul>
      </div>

      <!-- Paiements & Contact -->
      <div>
        <h3 class="text-black font-semibold mb-4 text-xl">Paiement sécurisé</h3>
        <div class="flex space-x-4 text-2xl mb-6">
          <i class="fab fa-cc-mastercard text-red-500"></i>
          <i class="fab fa-cc-paypal text-blue-500"></i>
          <span class="bg-orange-400 text-black px-2 py-1 rounded text-xs">Orange</span>
          <span class="bg-purple-600 text-black px-2 py-1 rounded text-xs">MTN</span>
        </div>

        <h3 class="text-black font-semibold mb-4 text-xl">Nous contacter</h3>
        <ul class="space-y-2 text-md">
          <li><i class="fas fa-map-marker-alt mr-2 text-red-500"></i> Douala, Cameroun</li>
          <li><i class="fas fa-phone-alt mr-2 text-green-500"></i> +237 674 69 36 25</li>
          <li><i class="fas fa-envelope mr-2 text-blue-500"></i> support@sie.com</li>
        </ul>
      </div>
    </div>

    <!-- Ligne séparation -->
    <div class="border-t border-gray-700 mt-10 pt-6 text-center text-md text-gray-400">
      © 2025 SIE. Tous droits réservés.
    </div>
  </footer>
</template>
