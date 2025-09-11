<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSpinner, faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import type { Country } from '@/types/country'
import { useCountryStore } from '@/stores/countryStore'
import 'vue3-toastify/dist/index.css'
import { toastError, toastSuccess } from '@/utils/toastConfig'
import CreateCountry from '@/components/CreateCountry.vue'
import EditCountry from '@/components/EditCountry.vue'

// Ajout des icônes
library.add(faSpinner, faEdit, faTrash, faPlus)

const countrys = ref<Country[]>([])
const countryData = ref<Country>()
const isLoading = ref(true)
const error = ref<string | null>(null)
const isOpenModalCreateCountry = ref(false)
const isOpenModalEditCountry = ref(false)

const countryStore = useCountryStore()

// ✅ Fetch countrys avec gestion loading, erreur et toast
const fetchCountrys = async () => {
  isLoading.value = true
  error.value = null

  try {
    const res = await countryStore.getCountry()
    countrys.value = res?.countrys ?? []
    toastSuccess(res?.message || 'Pays chargés avec succès')
  } catch (err: any) {
    console.error('Erreur lors du chargement des pays:', err)
    error.value = 'Impossible de charger les pays. Veuillez réessayer plus tard.'
    toastError(err.response?.data?.message || error.value)
  } finally {
    isLoading.value = false
  }
}

// Actions pour l'interface
const addCountry = () => {
  isOpenModalCreateCountry.value = true
}
const handleCountryCreated = () => {
  fetchCountrys()
  isOpenModalCreateCountry.value = false
}
const handleCountryUpdated = () => {
  fetchCountrys()
  isOpenModalEditCountry.value = false
}
const editCountry = (country: Country) => {
  isOpenModalEditCountry.value = true
  countryData.value = country
}
const deleteCountry = async (id: number) => {
  try {
    const res = await countryStore.deleteCountry(id)
    countrys.value = countrys.value.filter((c) => c.id !== id)
    toastSuccess(res?.message || 'Pays supprimé avec succès')
  } catch (err: any) {
    console.error('Erreur lors de la suppression du pays:', err)
    toastError(err.response?.data?.message || 'Impossible de supprimer ce pays')
  }
}

onMounted(fetchCountrys)
</script>

<template>
  <div class="p-6 w-full bg-gray-50 min-h-screen">
    <!-- Header + bouton ajouter -->
    <div class="flex flex-col gap-6 mb-6">
      <h1 class="text-4xl font-bold text-blue-500 text-center">Liste des pays</h1>
      <div class="flex justify-start">
        <button
          @click="addCountry"
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <font-awesome-icon icon="plus" />
          Ajouter un pays
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-10 text-blue-500">
      <font-awesome-icon icon="spinner" class="animate-spin text-4xl mr-3" />
      <p class="text-xl">Chargement des pays...</p>
    </div>

    <!-- Erreur -->
    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
    >
      <strong>Erreur :</strong> {{ error }}
    </div>

    <!-- Tableau des pays -->
    <div v-else class="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Nom du pays
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Code ISO
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Indicatif téléphonique
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="country in countrys" :key="country.id">
            <td class="px-6 py-4 text-sm text-gray-900">{{ country.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ country.iso_code }}</td>
            <td class="px-6 py-4 text-sm text-gray-500">{{ country.phone_code }}</td>
            <td class="px-6 py-4 flex gap-2">
              <button
                @click="editCountry(country)"
                class="text-orange-400 hover:text-orange-600 text-2xl"
              >
                <font-awesome-icon icon="edit" />
              </button>
              <button
                @click="deleteCountry(country.id!)"
                class="text-red-500 hover:text-red-700 text-2xl"
              >
                <font-awesome-icon icon="trash" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- MODAL CREATE-->
      <div
        v-if="isOpenModalCreateCountry"
        class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
      >
        <div class="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
          <!-- Bouton fermer -->
          <button
            @click="isOpenModalCreateCountry = false"
            class="absolute top-4 right-4 text-red-500 hover:text-red-600 cursor-pointer text-xl"
          >
            ✕
          </button>

          <!-- Contenu de l’édition -->
          <CreateCountry @create="handleCountryCreated" />
        </div>
      </div>
      <!-- MODAL EDIT-->
      <div
        v-if="isOpenModalEditCountry"
        class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
      >
        <div class="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
          <!-- Bouton fermer -->
          <button
            @click="isOpenModalEditCountry = false"
            class="absolute top-4 right-4 text-red-500 hover:text-red-600 cursor-pointer text-xl"
          >
            ✕
          </button>

          <!-- Contenu de l’édition -->
          <EditCountry @update="handleCountryUpdated" :country="countryData!" />
        </div>
      </div>

      <p v-if="countrys.length === 0" class="text-center text-gray-500 py-8">Aucun pays trouvé.</p>
    </div>
  </div>
</template>
