<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVisaRequestStore } from '@/stores/visaRequestStore'
import { useUserStore } from '@/stores/userStore'
import ShowVisaRequest from './ShowVisaRequest.vue'
import router from '@/router'

const userStore = useUserStore()
const visaRequestStore = useVisaRequestStore()
const visaRequestId = visaRequestStore.visaRequestId as number
const { user_id } = visaRequestStore.user_id as number
console.log('User ID from store:', user_id)

const visaRequest = ref<any>(null)
const loading = ref(true)
const isOpenCreate = ref(false)
const isOpenView = ref(false)
const selectedRequest = ref<any>(null)

// 👉 Format date (ex: "15 septembre 2025 à 12:21")
const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A'
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(dateStr))
}
const openView = (request: any) => {
  isOpenView.value = true
  selectedRequest.value = request
}
const deleteRequest = async (id: number) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) return
  try {
    await visaRequestStore.deleteVisaRequest(id)
    visaRequest.value = visaRequest.value.filter((req: any) => req.id !== id)
    alert('Demande supprimée avec succès.')
  } catch (error) {
    console.error('Erreur suppression demande :', error)
    alert('Erreur lors de la suppression. Veuillez réessayer plus tard.')
  }
}

onMounted(async () => {
  try {
    console.log('Chargement de la demande ID :', visaRequestId)
    const response = await visaRequestStore.showVisaRequest(visaRequestId)
    visaRequest.value = response
    console.log('✅ Demande chargée :', visaRequest.value)
  } catch (error) {
    console.error('❌ Erreur chargement demande', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-700">📑 Demandes de Visa</h1>
      <button
        @click="isOpenCreate = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
      >
        + Nouvelle demande
      </button>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="text-center text-blue-500 animate-pulse">
      Chargement des demandes...
    </div>

    <!-- Cards -->
    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        class="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col justify-between"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold text-gray-700">
            Visa {{ visaRequest.visa_type?.name }}
          </h2>
          <span
            class="px-2 py-1 text-xs font-medium rounded"
            :class="{
              'bg-green-100 text-green-700': visaRequest.status === 'approved',
              'bg-yellow-100 text-yellow-700': visaRequest.status === 'pending',
              'bg-red-100 text-red-700': visaRequest.status === 'rejected',
            }"
          >
            {{ visaRequest.status }}
          </span>
        </div>

        <!-- Infos -->
        <ul class="text-gray-600 text-sm space-y-1 mb-4">
          <li><b>Pays origine :</b> {{ visaRequest.origin_country?.name || 'N/A' }}</li>
          <li><b>Destination :</b> {{ visaRequest.destination_country?.name || 'N/A' }}</li>
          <li><b>Créée le :</b> {{ formatDate(visaRequest.created_at) }}</li>
        </ul>

        <!-- Actions -->
        <div class="flex justify-between mt-auto">
          <button
            @click="openView(visaRequest)"
            class="flex-1 mr-2 border border-gray-300 hover:bg-gray-50 text-gray-600 py-2 rounded-lg"
          >
            Details
          </button>
          <button
            @click="deleteRequest(visaRequest.id)"
            class="flex-1 ml-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- No data -->

    <!-- MODAL VIEW -->
    <div
      v-if="isOpenCreate"
      class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
    >
      <div class="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
        <button
          @click="isOpenCreate = false"
          class="absolute top-4 right-4 text-red-500 hover:text-red-600 cursor-pointer text-xl"
        >
          ✕
        </button>
      </div>
    </div>

    <!-- MODAL View -->
    <div
      v-if="isOpenView"
      class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
    >
      <div class="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
        <button
          @click="isOpenView = false"
          class="absolute top-4 right-4 text-red-500 hover:text-red-600 cursor-pointer text-xl"
        >
          ✕
        </button>
        <ShowVisaRequest />
      </div>
    </div>
  </div>
</template>
