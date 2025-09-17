<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVisaRequestStore } from '@/stores/visaRequestStore'
import { useRoute } from 'vue-router'

const route = useRoute()

// Store
const visaRequestStore = useVisaRequestStore()
const visaRequestId = visaRequestStore.visaRequestId as number

// States
const visaRequest = ref<Record<string, any> | null>(null)
const loading = ref(true)

// 👉 Format date (ex: "15 septembre 2025 à 12:21")
const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A'
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(dateStr))
}

// Fetch request details
onMounted(async () => {
  try {
    console.log('📥 Chargement de la demande avec ID :', route.params.id)
    const response = await visaRequestStore.showVisaRequest(Number(route.params.id))
    visaRequest.value = response
    console.log('✅ Demande chargée :', visaRequest.value)
  } catch (error) {
    console.error('❌ Erreur lors du chargement de la demande :', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <!-- Loader -->
    <div v-if="loading" class="text-blue-500 font-medium animate-pulse">
      Chargement des informations...
    </div>

    <!-- Détails de la demande -->
    <div
      v-else-if="visaRequest"
      class="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-8 space-y-8"
    >
      <!-- Header -->
      <div class="text-center space-y-1">
        <h1 class="text-2xl font-bold text-blue-600">🛂 Détails de la Demande de Visa</h1>
        <p class="text-gray-500 text-sm">
          ID Demande :
          <span class="font-medium">#{{ visaRequest.id }}</span>
        </p>
        <p class="text-gray-400 text-xs">Créée le : {{ formatDate(visaRequest.created_at) }}</p>
        <p class="text-gray-400 text-xs">
          Mise à jour le : {{ formatDate(visaRequest.updated_at) }}
        </p>
      </div>

      <!-- Statut -->
      <section class="bg-gray-50 rounded-xl p-5 shadow-sm">
        <h2 class="text-lg font-semibold text-blue-500 mb-3">📌 Statut</h2>
        <span
          class="px-3 py-1 text-sm rounded-md"
          :class="{
            'bg-green-100 text-green-700': visaRequest.status === 'approved',
            'bg-yellow-100 text-yellow-700': visaRequest.status === 'pending',
            'bg-red-100 text-red-700': visaRequest.status === 'rejected',
          }"
        >
          {{ visaRequest.status }}
        </span>
      </section>

      <!-- Visa Info -->
      <section class="bg-gray-50 rounded-xl p-5 shadow-sm">
        <h2 class="text-lg font-semibold text-purple-600 mb-3">📄 Informations Visa</h2>
        <ul class="text-gray-700 space-y-1">
          <li>
            <span class="font-bold">Type :</span>
            {{ visaRequest.visa_type?.name || 'N/A' }}
          </li>
          <li>
            <span class="font-bold">Description :</span>
            {{ visaRequest.visa_type?.description || '—' }}
          </li>
          <li>
            <span class="font-bold">Pays d’origine :</span>
            {{ visaRequest.origin_country?.name || 'N/A' }}
          </li>
          <li>
            <span class="font-bold">Destination :</span>
            {{ visaRequest.destination_country?.name || 'N/A' }}
          </li>
        </ul>
      </section>

      <!-- User Info -->
      <section class="bg-gray-50 rounded-xl p-5 shadow-sm">
        <h2 class="text-lg font-semibold text-orange-500 mb-3">👤 Informations Utilisateur</h2>
        <ul class="text-gray-700 space-y-1">
          <li><span class="font-bold">Nom :</span> {{ visaRequest.user?.name }}</li>
          <li><span class="font-bold">Email :</span> {{ visaRequest.user?.email }}</li>
          <li><span class="font-bold">Téléphone :</span> {{ visaRequest.user?.phone }}</li>
        </ul>
      </section>
    </div>

    <!-- Aucune donnée -->
    <div v-else class="text-red-500 font-medium">Aucune demande trouvée pour cet identifiant.</div>
  </div>
</template>
