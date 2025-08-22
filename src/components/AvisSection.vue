<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const testimonials = [
  {
    text: 'Un service rapide, efficace et une équipe à l’écoute. Je recommande sans hésiter !',
    name: 'Jean Dupont',
    role: 'Entrepreneur',
    img: 'https://i.pravatar.cc/100?img=1',
  },
  {
    text: 'Grâce à eux, j’ai pu lancer mon projet plus rapidement que prévu. Une super expérience !',
    name: 'Amina Ndiaye',
    role: 'Designer',
    img: 'https://i.pravatar.cc/100?img=5',
  },
  {
    text: 'Une équipe professionnelle et un accompagnement personnalisé. J’ai adoré travailler avec eux !',
    name: 'Marc Talla',
    role: 'Développeur',
    img: 'https://i.pravatar.cc/100?img=12',
  },
  {
    text: 'Le suivi en temps réel est incroyable, j’ai toujours su où en était ma demande.',
    name: 'Sophie Martin',
    role: 'Étudiante',
    img: 'https://i.pravatar.cc/100?img=32',
  },
  {
    text: 'Paiement simple et service au top ! Je recommande fortement.',
    name: 'Ousmane Diallo',
    role: 'Consultant',
    img: 'https://i.pravatar.cc/100?img=45',
  },
]

const currentIndex = ref(0)
let interval: any = null

const next = () => {
  if (currentIndex.value + 1 == testimonials.length) {
    currentIndex.value = 0
  }
  currentIndex.value = currentIndex.value + 1
}
const prev = () => {
  if (currentIndex.value - 1 == -1) {
    currentIndex.value = testimonials.length
  }
  currentIndex.value = currentIndex.value - 1
}

onMounted(() => {
  interval = setInterval(next, 10000)
})
onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>

<template>
  <section class="bg-gradient-to-br from-purple-600 to-blue-500 py-20">
    <div class="max-w-6xl mx-auto px-6">
      <!-- Titre -->
      <h2 class="text-4xl md:text-5xl font-extrabold text-center text-white mb-12 tracking-tight">
        Témoignages
      </h2>

      <!-- Container slider -->
      <div class="relative overflow-hidden">
        <!-- Liste d'avis -->
        <div
          class="flex transition-transform duration-700 ease-in-out"
          :style="{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }"
        >
          <div
            v-for="(t, i) in testimonials"
            :key="i"
            class="min-w-full md:min-w-1/2 lg:min-w-1/3 px-4 flex"
          >
            <div
              class="bg-white/90 backdrop-blur-md rounded-3xl shadow-lg p-8 w-full text-center hover:scale-105 transform transition"
            >
              <p class="text-gray-700 mb-6 italic text-lg">“{{ t.text }}”</p>
              <div class="flex items-center justify-center gap-4">
                <img :src="t.img" :alt="t.name" class="w-14 h-14 rounded-full" />
                <div class="text-left">
                  <h4 class="font-semibold text-gray-900">{{ t.name }}</h4>
                  <span class="text-sm text-gray-500">{{ t.role }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Boutons navigation -->
        <button
          @click="prev"
          class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-3 rounded-full shadow-lg"
        >
          <i class="fas fa-chevron-left text-purple-600"></i>
        </button>
        <button
          @click="next"
          class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-3 rounded-full shadow-lg"
        >
          <i class="fas fa-chevron-right text-purple-600"></i>
        </button>
      </div>

      <!-- Dots -->
      <div class="flex justify-center mt-6 gap-2">
        <span
          v-for="(t, i) in testimonials"
          :key="i"
          @click="currentIndex = i"
          class="w-3 h-3 rounded-full cursor-pointer transition"
          :class="currentIndex === i ? 'bg-orange-400 scale-110' : 'bg-white/50'"
        ></span>
      </div>
    </div>
  </section>
</template>
