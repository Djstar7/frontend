<template>
  <section class="py-20 bg-white">
    <div class="mx-auto px-6">
      <!-- Titre de la section -->
      <h2 class="text-4xl md:text-5xl font-bold text-center text-blue-500 mb-12">Nos Services</h2>

      <!-- Grid des services -->
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <!-- Service 1: Liste des documents -->
        <div
          class="bg-blue-100 text-black rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition-transform"
        >
          <i class="fa-solid fa-file-lines text-5xl mb-4 text-blue-500"></i>
          <h3 class="text-2xl font-semibold mb-2">Documents requis</h3>
          <p>
            Consultez la liste dynamique des documents requis selon votre profil, type de visa et
            pays de destination.
          </p>
        </div>

        <!-- Service 2: Téléversement et suivi -->
        <div
          class="bg-blue-100 text-black rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition-transform"
        >
          <i class="fa-solid fa-upload text-5xl mb-4 text-purple-600"></i>
          <h3 class="text-2xl font-semibold mb-2">Téléversement & Suivi</h3>
          <p>
            Téléversez vos documents et suivez en temps réel l’avancement via notifications et
            suggestions de nos agents.
          </p>
        </div>

        <!-- Service 3: Notifications et rendez-vous -->
        <div
          class="bg-blue-100 text-black rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition-transform"
        >
          <i class="fa-solid fa-bell text-5xl mb-4 text-orange-400"></i>
          <h3 class="text-2xl font-semibold mb-2">Notifications & Rendez-vous</h3>
          <p>
            Recevez des notifications instantanées pour la prise de rendez-vous et le suivi de vos
            demandes.
          </p>
        </div>

        <!-- Service 4: Paiement sécurisé -->
        <div
          class="bg-blue-100 text-black rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition-transform"
        >
          <i class="fa-solid fa-credit-card text-5xl mb-4 text-red-500"></i>
          <h3 class="text-2xl font-semibold mb-2">Paiement sécurisé</h3>
          <p>
            Payez vos sous-dossiers en toute sécurité via MTN, Orange, Mastercard ou PayPal avant
            traitement final.
          </p>
        </div>

        <!-- Service 5: Suggestions agents
        <div
          class="bg-blue-500 text-black rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:scale-105 transition-transform"
        >
          <i class="fa-solid fa-comments text-5xl mb-4"></i>
          <h3 class="text-2xl font-semibold mb-2">Assistance Agent</h3>
          <p>
            Recevez des suggestions personnalisées de nos agents pour vous guider étape par étape.
          </p>
        </div>-->
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Tu peux remplacer cette section par une liste dynamique de services venant de l'API si besoin
</script>

<style scoped>
/* Pour un effet léger de transition des cartes */
div > .hover\:scale-105:hover {
  transition: transform 0.3s ease;
}
</style>
