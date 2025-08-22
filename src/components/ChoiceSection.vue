<template>
  <section class="py-20 bg-white">
    <div class="mx-auto px-6">
      <!-- Titre -->
      <h2 class="text-4xl md:text-5xl font-bold text-center text-blue-500 mb-12">
        Pourquoi nous choisir ?
      </h2>

      <!-- Grid des raisons -->
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <!-- Raison 1: Rapidité -->
        <div
          class="bg-blue-100 text-black rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition-transform"
        >
          <i class="fa-solid fa-bolt text-5xl mb-4 text-blue-500"></i>
          <h3 class="text-2xl font-semibold mb-2">Rapidité</h3>
          <p>Un traitement efficace de vos documents et démarches avec un suivi en temps réel.</p>
        </div>

        <!-- Raison 2: Sécurité -->
        <div
          class="bg-blue-100 text-black rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition-transform"
        >
          <i class="fa-solid fa-shield-halved text-5xl mb-4 text-purple-600"></i>
          <h3 class="text-2xl font-semibold mb-2">Sécurité</h3>
          <p>
            Vos informations et documents sont protégés avec les standards de sécurité les plus
            stricts.
          </p>
        </div>

        <!-- Raison 3: Assistance personnalisée -->
        <div
          class="bg-blue-100 text-black rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition-transform"
        >
          <i class="fa-solid fa-user-tie text-5xl mb-4 text-orange-400"></i>
          <h3 class="text-2xl font-semibold mb-2">Assistance personnalisée</h3>
          <p>Nos agents vous guident étape par étape pour simplifier vos démarches.</p>
        </div>

        <!-- Raison 4: Paiement facile -->
        <div
          class="bg-blue-100 text-black rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition-transform"
        >
          <i class="fa-solid fa-credit-card text-5xl mb-4 text-red-500"></i>
          <h3 class="text-2xl font-semibold mb-2">Paiement facile</h3>
          <p>
            Payez vos sous-dossiers de manière simple et sécurisée via MTN, Orange, Mastercard ou
            PayPal.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Tu peux remplacer par une liste dynamique si tu veux générer les cartes via v-for
</script>

<style scoped>
/* Effet hover léger sur les cartes */
div > .hover\:scale-105:hover {
  transition: transform 0.3s ease;
}
</style>
