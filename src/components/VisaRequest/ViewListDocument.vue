<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useVisaRequestStore } from '@/stores/visaRequestStore'
import { useVisaStore } from '@/stores/visaStore'
import { toastError, toastSuccess } from '@/utils/toastConfig'
import type { VisaRequestPayload } from '@/types/visa'

const router = useRouter()
const visaStore = useVisaStore()
const userStore = useUserStore()
const visaRequestStore = useVisaRequestStore()

const visaRequestId = ref<number>()

const getStatus = (status: string | null) => {
  if (!status) return 'N/A'
  switch (status.toLowerCase()) {
    case 'single':
      return 'Célibataire'
    case 'married':
      return 'Marié(e)'
    case 'divorced':
      return 'Divorcé(e)'
    case 'widowed':
      return 'Veuf(ve)'
    default:
      return status
  }
}
const visaData = ref<any>()

visaData.value = visaStore.visa
console.log('data jbhj', visaData.value)

const submitVisaRequest = async () => {
  try {
    const { nationality } = userStore.profil!
    const { id } = userStore.user!
    const { country_dest_name, visa_type_name, user_id } = visaStore.visarequest

    if (id !== user_id) {
      return toastError('Visa invalide pour cet utilisateur')
    }
    console.log('Country:', country_dest_name)
    console.log('VisaType:', visa_type_name)

    const payload: VisaRequestPayload = {
      user_id: id!,
      country_dest_name: country_dest_name,
      visa_type_name: visa_type_name,
      nationality,
    }
    console.log('Payload visa request:', payload)

    const res = await visaRequestStore.createVisaRequest(payload)
    if (!res) throw new Error('Erreur lors de la création de la demande de visa')
    toastSuccess(res.message || 'Demande de visa créée avec succès')
    console.log('Created VisaRequest:', visaRequestStore.visaRequestId)
    visaRequestId.value = visaRequestStore.visaRequestId as number
    console.log('VisaRequest ID:', visaRequestId.value)
    router.push({ name: 'custom.visarequest.create.upload', params: { id: visaRequestId.value } })
  } catch (err: any) {
    toastError(err?.message || 'Erreur lors de la création de la demande de visa')
    return null
  }
}
const deleteProcessing = () => {
  localStorage.removeItem('visa')
  toastSuccess('visa supprimer')
  router.push({ name: 'custom.visarequest.create' })
}
</script>

<template>
  <div class="w-full grid grid-cols-1 px-4 md:px-12 py-8 gap-12">
    <!-- Titre -->
    <div class="text-center w-full">
      <h1 class="text-4xl font-extrabold text-purple-600 mb-2">Résumé de votre Visa ✈️</h1>
    </div>

    <!-- Infos principales -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
      <div
        class="p-6 bg-gradient-to-r from-orange-50 to-orange-100 text-black rounded-2xl shadow-lg text-center w-full"
      >
        <h2 class="text-lg font-semibold">Pays</h2>
        <p class="text-2xl font-bold mt-2">{{ visaData.country }}</p>
      </div>
      <div
        class="p-6 bg-gradient-to-r from-purple-50 to-purple-100 text-black rounded-2xl shadow-lg text-center w-full"
      >
        <h2 class="text-lg font-semibold">Type de Visa</h2>
        <p class="text-2xl font-bold mt-2">{{ visaData.visaType }}</p>
      </div>
      <div
        class="p-6 bg-gradient-to-r from-red-50 to-red-100 text-black rounded-2xl shadow-lg text-center w-full"
      >
        <h2 class="text-lg font-semibold">Statut matrimonial</h2>
        <p class="text-2xl font-bold mt-2">{{ getStatus(visaData.status_mat || null) }}</p>
      </div>
    </div>

    <!-- Prix et durée -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
      <div
        class="p-6 bg-gradient-to-r from-blue-50 to-blue-100 text-black rounded-2xl shadow-lg text-center w-full"
      >
        <h2 class="text-lg font-semibold">Prix du traitement</h2>
        <p class="text-3xl font-extrabold mt-2">{{ visaData.price }} FCFA</p>
      </div>
      <div
        class="p-6 bg-gradient-to-r from-orange-50 to-orange-100 text-black rounded-2xl shadow-lg text-center w-full"
      >
        <h2 class="text-lg font-semibold">Durée de traitement</h2>
        <p class="text-2xl font-bold mt-2">
          {{ visaData.processing_times.processing_duration_min }} -
          {{ visaData.processing_times.processing_duration_max }} jours
        </p>
      </div>
    </div>

    <!-- Documents requis -->
    <div class="w-full">
      <h2 class="text-3xl font-bold text-purple-600 mb-4">📑 Documents requis</h2>
      <ul class="space-y-4 w-full">
        <li
          v-for="(doc, index) in visaData.documents"
          :key="index"
          class="flex items-center p-4 bg-gray-50 rounded-xl shadow transition w-full"
        >
          <span
            class="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full font-bold"
          >
            {{ index + 1 }}
          </span>
          <span class="ml-4 text-gray-700 font-medium">{{ doc }}</span>
        </li>
      </ul>
    </div>

    <!-- Boutons -->
    <div class="flex w-full justify-between">
      <button
        class="px-8 py-4 cursor-pointer bg-blue-600 text-white font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
        @click="deleteProcessing"
      >
        Recommencer
      </button>
      <button
        @click="submitVisaRequest"
        class="ml-6 px-6 py-3 cursor-pointer text-white text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-400 rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-all animate-gradient"
      >
        Lancer la procédure 🚀
      </button>
    </div>
  </div>
</template>

<style></style>
