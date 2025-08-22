<script setup lang="ts">
import AvisSection from '@/components/AvisSection.vue'
import ServicesSection from '@/components/ServicesSection.vue'
import ChoiceSection from '@/components/ChoiceSection.vue'
import SiderBar from '@/components/SiderBarSection.vue'
</script>

<template>
  <div class="bg-gradient-to-br from-blue-500 via-purple-600 to-orange-400 text-white">
    <!-- HERO SECTION -->
    <section class="relative flex flex-col lg:flex-row">
      <!-- Texte d'accueil -->
      <div class="z-30 md:px-10 lg:w-1/2 lg:p-20 p-4">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg">
          Simplifiez vos démarches de visa <br />
          <span class="text-orange-300">en toute sérénité</span>
        </h1>
        <p class="mt-6 text-lg sm:text-xl text-gray-100 max-w-lg leading-relaxed">
          Une plateforme
          <span class="font-semibold text-yellow-200">intelligente et sécurisée</span> conçue pour
          vous accompagner à chaque étape : documents requis, suivi en temps réel, notifications et
          assistance de nos experts.
        </p>
        <div class="mt-8 flex flex-wrap gap-4">
          <router-link
            :to="{ name: 'auth.login' }"
            class="px-6 py-3 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-full shadow-lg transition duration-300"
          >
            🚀 Commencer maintenant
          </router-link>

          <router-link
            :to="{ name: 'home' }"
            class="px-6 py-3 bg-white text-blue-600 hover:bg-gray-200 font-semibold rounded-full shadow-lg transition duration-300"
          >
            ℹ️ En savoir plus
          </router-link>
        </div>
      </div>

      <!-- Slider -->
      <div class="lg:w-1/2 flex items-start justify-start">
        <SiderBar />
      </div>
    </section>

    <!-- Sections suivantes -->
    <ServicesSection />
    <ChoiceSection />
    <AvisSection />
  </div>
</template>
