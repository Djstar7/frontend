<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVisaRequestStore } from '@/stores/visaRequestStore'

const visaRequestStore = useVisaRequestStore()
const visaRequestId = visaRequestStore.visaRequestId as number

const receipt = ref<any>(null)
const loading = ref(true)

// 👉 Format date (ex: "15 septembre 2025 à 12:21")
const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A'
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(dateStr))
}

onMounted(async () => {
  try {
    console.log('📥 Récupération du reçu pour la demande ID :', visaRequestId)
    const response = await visaRequestStore.showVisaRequest(visaRequestId)
    receipt.value = response
    console.log('✅ Reçu chargé :', receipt.value)
  } catch (error) {
    console.error('❌ Erreur chargement reçu', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <!-- Loader -->
    <div v-if="loading" class="text-blue-500 font-medium animate-pulse">
      Chargement des détails...
    </div>

    <!-- Reçu -->
    <div v-else-if="receipt" class="bg-white shadow-xl rounded-2xl w-full max-w-3xl p-8 space-y-8">
      <!-- Header -->
      <div class="text-center space-y-1">
        <h1 class="text-2xl font-bold text-blue-600">🧾 Détails du Reçu de Paiement</h1>
        <p class="text-gray-500 text-sm">
          Référence : <span class="font-medium">{{ receipt.receipt_id }}</span>
        </p>
        <p class="text-gray-400 text-xs">Créé le : {{ formatDate(receipt.created_at) }}</p>
      </div>

      <!-- Payment Info -->
      <section class="bg-gray-50 rounded-xl p-5 shadow-sm">
        <h2 class="text-lg font-semibold text-blue-500 mb-3">💳 Paiement</h2>
        <ul class="text-gray-700 space-y-1">
          <li>
            <span class="font-medium">Montant :</span>
            {{ receipt.payment.amount }} {{ receipt.payment.currency }}
          </li>
          <li>
            <span class="font-medium">Transaction :</span>
            {{ receipt.payment.transaction_id }}
          </li>
          <li>
            <span class="font-medium">Méthode :</span>
            {{ receipt.payment.method }}
          </li>
          <li>
            <span class="font-medium">Statut :</span>
            <span
              class="px-2 py-1 text-sm rounded-md"
              :class="{
                'bg-green-100 text-green-700': receipt.payment.status === 'success',
                'bg-yellow-100 text-yellow-700': receipt.payment.status === 'pending',
                'bg-red-100 text-red-700': receipt.payment.status === 'failed',
              }"
            >
              {{ receipt.payment.status }}
            </span>
          </li>
        </ul>
      </section>

      <!-- Visa Info -->
      <section class="bg-gray-50 rounded-xl p-5 shadow-sm">
        <h2 class="text-lg font-semibold text-purple-600 mb-3">🛂 Visa</h2>
        <ul class="text-gray-700 space-y-1">
          <li>
            <span class="font-medium">Type :</span>
            {{ receipt.visa_request.visa_type || 'N/A' }}
          </li>
          <li>
            <span class="font-medium">Pays d’origine :</span>
            {{ receipt.visa_request.origin_country || 'N/A' }}
          </li>
          <li>
            <span class="font-medium">Destination :</span>
            {{ receipt.visa_request.destination_country || 'N/A' }}
          </li>
        </ul>
      </section>

      <!-- User Info -->
      <section class="bg-gray-50 rounded-xl p-5 shadow-sm">
        <h2 class="text-lg font-semibold text-orange-500 mb-3">👤 Utilisateur</h2>
        <ul class="text-gray-700 space-y-1">
          <li><span class="font-medium">Nom :</span> {{ receipt.user.name }}</li>
          <li><span class="font-medium">Email :</span> {{ receipt.user.email }}</li>
          <li><span class="font-medium">Téléphone :</span> {{ receipt.user.phone }}</li>
        </ul>
      </section>

      <!-- File Link -->
      <div class="text-center">
        <a
          v-if="receipt.file_path"
          :href="receipt.file_path"
          target="_blank"
          class="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          📂 Télécharger le fichier
        </a>
      </div>
    </div>

    <!-- Aucun reçu -->
    <div v-else class="text-red-500 font-medium">Aucun reçu trouvé pour cette demande.</div>
  </div>
</template>
