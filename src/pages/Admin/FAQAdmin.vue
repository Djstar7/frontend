<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSpinner, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import type { FaqChat } from '@/types/faqchat'
import { useFaqChatStore } from '@/stores/faqchatore'
import 'vue3-toastify/dist/index.css'
import { toastError, toastInfo, toastSuccess } from '@/utils/toastConfig'

// Ajout des icônes
library.add(faSpinner, faEdit, faTrash, faPlus)

const faqChats = ref<FaqChat[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const faqchatStore = useFaqChatStore()

// ✅ Fetch questions avec gestion loading, erreur et toast
const fetchFaqChat = async () => {
  isLoading.value = true
  error.value = null

  try {
    const res = await faqchatStore.getFaqChat()
    faqChats.value = res?.faqchats ?? []
    toastSuccess(res?.message || 'Questions chargées avec succès')
  } catch (err: any) {
    console.error('Erreur lors du chargement des questions:', err)
    error.value = 'Impossible de charger les questions. Veuillez réessayer plus tard.'
    toastError(err.response?.data?.message || error.value)
  } finally {
    isLoading.value = false
  }
}

// Actions pour l'interface
const addFaqChat = () => {
  toastInfo('Ajouter une nouvelle question (fonction à implémenter)')
}
const editFaqChat = (faqchat: FaqChat) => {
  toastInfo(`Éditer la question "${faqchat.question}" (fonction à implémenter)`)
}
const deleteFaqChat = async (id: number) => {
  try {
    const res = await faqchatStore.deleteFaqChat(id)
    faqChats.value = faqChats.value.filter((q) => q.id !== id)
    toastSuccess(res?.message || 'Question supprimée avec succès')
  } catch (err: any) {
    console.error('Erreur lors de la suppression de la question:', err)
    toastError(err.response?.data?.message || 'Impossible de supprimer cette question')
  }
}

onMounted(fetchFaqChat)
</script>

<template>
  <div class="p-6 w-full bg-gray-50 min-h-screen">
    <!-- Header + bouton ajouter -->
    <div class="flex flex-col gap-6 mb-6">
      <h1 class="text-4xl font-bold text-purple-600 text-center">Liste des questions</h1>
      <div class="flex justify-start">
        <button
          @click="addFaqChat"
          class="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
        >
          <font-awesome-icon icon="plus" />
          Ajouter une question
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-10 text-purple-600">
      <font-awesome-icon icon="spinner" class="animate-spin text-4xl mr-3" />
      <p class="text-xl">Chargement des questions...</p>
    </div>

    <!-- Erreur -->
    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
    >
      <strong>Erreur :</strong> {{ error }}
    </div>

    <!-- Tableau des questions -->
    <div v-else class="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Question
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Réponse
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Catégorie
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="qa in faqChats" :key="qa.id">
            <td class="px-6 py-4 text-sm text-gray-900">{{ qa.question }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ qa.answer }}</td>
            <td class="px-6 py-4 text-sm text-gray-500 capitalize">{{ qa.category }}</td>
            <td class="px-6 py-4 flex gap-2">
              <button
                @click="editFaqChat(qa)"
                class="text-orange-400 hover:text-orange-600 text-2xl"
              >
                <font-awesome-icon icon="edit" />
              </button>
              <button
                @click="deleteFaqChat(qa.id!)"
                class="text-red-500 hover:text-red-700 text-2xl"
              >
                <font-awesome-icon icon="trash" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="faqChats.length === 0" class="text-center text-gray-500 py-8">
        Aucune question trouvée.
      </p>
    </div>
  </div>
</template>
