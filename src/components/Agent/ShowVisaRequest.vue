<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVisaRequestStore } from '@/stores/visaRequestStore'
import { useRoute } from 'vue-router'
import { toastInfo, toastError, toastSuccess } from '@/utils/toastConfig'
import router from '@/router'

// Store & Route
const route = useRoute()
const visaRequestStore = useVisaRequestStore()
const visaRequestId = Number(route.params.visaRequestId)

// States
const visaRequest = ref<Record<string, any> | null>(null)
const loading = ref(true)
const updatingStatus = ref(false)

// Format date
const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A'
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeStyle: 'short' }).format(
    new Date(dateStr),
  )
}

// Fetch demande de visa
const fetchVisaRequest = async () => {
  loading.value = true
  try {
    const response = await visaRequestStore.showVisaRequest(visaRequestId)
    visaRequest.value = response
  } catch (error: any) {
    toastError('Erreur lors du chargement de la demande.')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// Modifier le statut
const updateStatus = async (newStatus: string) => {
  if (!visaRequest.value) return
  updatingStatus.value = true
  try {
    const res = await visaRequestStore.editVisaRequest(visaRequestId, { status: newStatus })
    visaRequest.value.status = newStatus
    toastSuccess(res.message ?? 'Statut mis à jour avec succès.')
  } catch (error: any) {
    toastError('Impossible de mettre à jour le statut.')
    console.error(error)
  } finally {
    updatingStatus.value = false
  }
}

// Consulter documents
const goToDocuments = () => {
  if (!visaRequest.value) return
  router.push({
    name: 'agent.users.show.visarequest.show.document',
    params: { visaRequestId: visaRequest.value.id },
  })
}

onMounted(fetchVisaRequest)
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex justify-center p-6">
    <div v-if="loading" class="text-blue-500 font-medium animate-pulse">Chargement...</div>

    <div
      v-else-if="visaRequest"
      class="bg-white shadow-xl rounded-2xl w-full max-w-4xl p-8 space-y-6"
    >
      <!-- Header -->
      <div class="text-center space-y-2">
        <h1 class="text-2xl font-bold text-blue-600">🛂 Détails de la Demande de Visa</h1>
        <p class="text-gray-500 text-sm">
          ID : <span class="font-medium">#{{ visaRequest.id }}</span>
        </p>
        <p class="text-gray-400 text-xs">Créée le : {{ formatDate(visaRequest.created_at) }}</p>
        <p class="text-gray-400 text-xs">
          Mise à jour le : {{ formatDate(visaRequest.updated_at) }}
        </p>
      </div>

      <!-- Statut -->
      <section class="bg-gray-50 rounded-xl p-5 shadow-sm flex justify-between items-center">
        <div>
          <h2 class="text-lg font-semibold text-blue-500 mb-2">📌 Statut</h2>
          <span
            class="px-3 py-1 rounded-md font-medium capitalize"
            :class="{
              'bg-green-100 text-green-700': visaRequest.status === 'approved',
              'bg-yellow-100 text-yellow-700': visaRequest.status === 'pending',
              'bg-red-100 text-red-700': visaRequest.status === 'rejected',
            }"
          >
            {{ visaRequest.status }}
          </span>
        </div>

        <!-- Select pour changer statut -->
        <div class="flex items-center space-x-2">
          <select
            v-model="visaRequest.status"
            class="border rounded-md px-3 py-1"
            :disabled="updatingStatus"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            @click="updateStatus(visaRequest.status)"
            class="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-1 rounded-md transition"
            :disabled="updatingStatus"
          >
            {{ updatingStatus ? 'Mise à jour...' : 'Mettre à jour' }}
          </button>
        </div>
      </section>

      <!-- Visa Info -->
      <section class="bg-gray-50 rounded-xl p-5 shadow-sm">
        <h2 class="text-lg font-semibold text-purple-600 mb-3">📄 Informations Visa</h2>
        <ul class="text-gray-700 space-y-1">
          <li><span class="font-bold">Type :</span> {{ visaRequest.visa_type?.name || 'N/A' }}</li>
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

      <!-- Bouton documents -->
      <div class="flex justify-center mt-4">
        <button
          @click="goToDocuments"
          class="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-lg transition"
        >
          📄 Consulter les documents liés
        </button>
      </div>
    </div>

    <div v-else class="text-red-500 font-medium">Aucune demande trouvée pour cet identifiant.</div>
  </div>
</template>
