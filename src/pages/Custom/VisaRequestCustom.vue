<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVisaRequestStore } from '@/stores/visaRequestStore'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
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
  router.push({ name: 'custom.visarequest.show.get', params: { id: request.id } })
  console.log('Ouvrir la demande :', request)
}

const deleteRequest = async (id: number) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) return
  try {
    await visaRequestStore.deleteVisaRequest(id)

    alert('✅ Demande supprimée avec succès.')

    // recharge les données après suppression
    await fetchVisaRequests()
  } catch (error) {
    console.error('❌ Erreur suppression demande :', error)
    alert('Erreur lors de la suppression. Veuillez réessayer plus tard.')
  }
}

const openCreate = () => {
  router.push({ name: 'custom.visarequest.create' })
}

const fetchVisaRequests = async () => {
  try {
    const { id } = userStore.user!
    console.log('Chargement des demandes pour User ID :', id)
    const response = await visaRequestStore.showVisaRequestByUser(id!)

    if (!response || response.length === 0) {
      console.warn('🚨 Aucune demande trouvée → redirection vers création')
      return router.replace({ name: 'custom.visarequest.create' })
    }

    visaRequests.value = response
    console.log('✅ Demandes chargées :', visaRequests.value)
  } catch (error) {
    console.error('❌ Erreur chargement demandes', error)
    router.replace({ name: 'custom.visarequest.create' })
  } finally {
    loading.value = false
  }
}

onMounted(fetchVisaRequests)
</script>

<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-700">📑 Demandes de Visa</h1>
      <button
        @click="openCreate"
        class="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-lg shadow"
      >
        + Nouvelle demande
      </button>
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
        <div class="flex justify-between mt-auto">
          <!-- Bouton détails (orange) -->
          <button
            @click="openView(request)"
            class="flex-1 mr-2 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg transition duration-200"
          >
            Détails
          </button>

          <!-- Bouton supprimer (rouge) -->
          <button
            @click="deleteRequest(request.id)"
            class="flex-1 ml-2 bg-red-500 cursor-pointer hover:bg-red-600 text-white font-medium py-2 rounded-lg transition duration-200"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
