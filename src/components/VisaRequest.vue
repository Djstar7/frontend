<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVisaRequestStore } from '@/stores/visaRequestStore'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const visaRequestStore = useVisaRequestStore()

const visaRequests = ref<any[]>([]) // ✅ tableau de demandes
const loading = ref(true)
const isOpenView = ref(false)
const selectedRequest = ref<any>(null)

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
  router.push({
    name: 'agent.users.show.visarequest.show',
    params: { visaRequestId: request.id },
  })
  console.log('Ouvrir la demande :', request)
}

const fetchVisaRequests = async () => {
  try {
    const response = await visaRequestStore.showVisaRequestByUser(Number(route.params.userId))

    visaRequests.value = response
    console.log('✅ Demandes chargées :', visaRequests.value)
  } catch (error) {
    console.error('❌ Erreur chargement demandes', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchVisaRequests)
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-4xl font-bold text-purple-600">📑 Demandes de Visa</h1>
    </div>

    <!-- Loader -->
    <div v-if="loading" class="text-center text-blue-500 animate-pulse">
      Chargement des demandes...
    </div>

    <!-- Liste des demandes -->
    <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="request in visaRequests"
        :key="request.id"
        class="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col justify-between"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-lg font-semibold text-gray-700">Visa {{ request.visa_type?.name }}</h2>
          <span
            class="px-2 py-1 text-xs font-medium rounded"
            :class="{
              'bg-green-100 text-green-700': request.status === 'approved',
              'bg-yellow-100 text-yellow-700': request.status === 'pending',
              'bg-red-100 text-red-700': request.status === 'rejected',
            }"
          >
            {{ request.status }}
          </span>
        </div>

        <!-- Infos -->
        <ul class="text-gray-600 text-sm space-y-1 mb-4">
          <li><b>Pays origine :</b> {{ request.origin_country?.name || 'N/A' }}</li>
          <li><b>Destination :</b> {{ request.destination_country?.name || 'N/A' }}</li>
          <li><b>Créée le :</b> {{ formatDate(request.created_at) }}</li>
        </ul>

        <!-- Actions -->
        <div class="flex mt-auto">
          <!-- Bouton détails (orange) -->
          <button
            @click="openView(request)"
            class="flex-1 mr-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition duration-200"
          >
            Détails
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
