<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { toastError, toastSuccess } from '@/utils/toastConfig'
import type { Country } from '@/types/country'
import type { Visa, VisaType } from '@/types/visa'
import { useVisaTypeStore } from '@/stores/visaTypeStore'
import { useCountryStore } from '@/stores/countryStore'
import { useVisaStore } from '@/stores/visaStore'
import router from '@/router'
import { useUserStore } from '@/stores/userStore'

// ---------------- ÉTATS ----------------
const step = ref(1)
const completedSteps = ref<number[]>([])

const countrys = ref<Country[]>([])
const visaTypes = ref<VisaType[]>([])
const selectedVisaType = ref<VisaType | null>(null)
const isResponse = ref<boolean>(false)
const visaData = ref<any | null>(null)

const storedUser = localStorage.getItem('user')
if (!storedUser) throw new Error('Aucun utilisateur trouvé')
const { id } = JSON.parse(storedUser)

const visatypeStore = useVisaTypeStore()
const countryStore = useCountryStore()
const visaStore = useVisaStore()
const userStore = useUserStore()

// ---------------- FETCH DATA ----------------
const loadData = async () => {
  // Vérifier d'abord si un visa existe dans le localStorage
  const storedVisa = localStorage.getItem('visa')
  const { id } = userStore.user!

  if (storedVisa) {
    const parsedVisa = JSON.parse(storedVisa) // ✅ maintenant c'est un objet
    const { user_id } = parsedVisa

    if (id === user_id) {
      visaData.value = parsedVisa
      isResponse.value = true
      toastSuccess('Visa chargé depuis le cache')
      return // stop, pas besoin de recharger les pays/types
    }
  }

  // Si aucun visa en cache, on charge depuis l’API
  try {
    const resCountrys = await countryStore.getCountry()
    toastSuccess(resCountrys.message || 'Pays chargés avec succès')
    const resVisaType = await visatypeStore.getVisaType()
    toastSuccess(resVisaType.message || 'Types de visa chargés avec succès')

    countrys.value = resCountrys.countrys || []
    visaTypes.value = resVisaType.visatypes || []
  } catch {
    toastError('Erreur de chargement des données')
  }
}
onMounted(loadData)

// ---------------- NAVIGATION ----------------
const isCompleted = (n: number) => completedSteps.value.includes(n)
const nextStep = () => {
  if (!isCompleted(step.value)) completedSteps.value.push(step.value)
  step.value++
}
const prevStep = () => step.value--

// ---------------- ACTIONS ----------------
const selectVisa = (visa: VisaType) => {
  selectedVisaType.value = visa
  nextStep()
}
const statusMap: Record<string, string> = {
  single: 'Célibataire',
  married: 'Marié(e)',
  divorced: 'Divorcé(e)',
  widowed: 'Veuf/Veuve',
}
const getStatus = (status: string | null) => {
  if (!status) return 'Non renseigné'
  return statusMap[status] || status
}
const submit = async () => {
  try {
    if (!selectedCountry.value || !selectedVisaType.value) {
      return toastError('Veuillez sélectionner un pays et un type de visa')
    }
    console.log(searchCountry.value)
    const payload: Visa = {
      user_id: id,
      country_dest_name: searchCountry.value,
      visa_type_name: selectedVisaType.value.name,
    }

    const res = await visaStore.createStoreVisa(payload)
    visaData.value = res
    console.log(res)
    isResponse.value = true
    toastSuccess(res.message || 'Demande enregistrée avec succès')
  } catch (err: any) {
    toastError(visaStore.error || 'Erreur serveur')
  }
}
const deleteProcessing = () => {
  localStorage.removeItem('visa')
  toastSuccess('visa supprimer')
  router.go(0)
}

// -------------------------
// Dropdown custom Pays
// -------------------------
const isCountryOpen = ref(false)
const searchCountry = ref('')
const selectedCountry = ref<Country | null>(null)

const filteredCountries = computed(() => {
  if (!searchCountry.value) return countrys.value
  return countrys.value.filter((c) =>
    c.name.toLowerCase().includes(searchCountry.value.toLowerCase()),
  )
})

function selectCountry(country: Country) {
  selectedCountry.value = country
  searchCountry.value = country.name
  isCountryOpen.value = false
}

function closeCountryDropdown() {
  isCountryOpen.value = false
  if (selectedCountry.value) {
    searchCountry.value = selectedCountry.value.name
  }
}
</script>

<template>
  <div
    v-if="!isResponse"
    class="min-h-screen py-2 px-1 w-full bg-gradient-to-br from-blue-50 to-gray-100"
  >
    <!-- 🚀 Stepper fixé en haut -->
    <div class="w-full relative">
      <div class="flex justify-between items-start relative">
        <div v-for="n in 2" :key="n" class="flex-1 flex flex-col items-start justify-start z-10">
          <div
            class="flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold border-4 transition-all duration-500 shadow-md"
            :class="[
              isCompleted(n)
                ? 'bg-blue-600 border-blue-600 text-white'
                : step === n
                  ? 'border-blue-500 text-blue-500 bg-white scale-110'
                  : 'border-gray-200 text-gray-400 bg-white',
            ]"
          >
            <i v-if="isCompleted(n)" class="fas fa-check"></i>
            <span v-else>{{ n }}</span>
          </div>
          <span
            class="mt-2 text-sm font-medium"
            :class="step === n ? 'text-blue-600' : 'text-gray-500'"
          >
            Étape {{ n }}
          </span>
        </div>

        <!-- Barre de progression -->
        <div
          class="absolute top-1/2 w-full left-0 right-0 h-1 -translate-y-1/2 bg-gray-200 rounded-full"
        ></div>
        <div
          class="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-blue-600 rounded-full transition-all duration-500"
          :style="{ width: `${((step - 1) / 2) * 100}%` }"
        ></div>
      </div>
    </div>

    <!--  Contenu (avec padding pour ne pas passer sous le stepper) -->
    <div class="w-full min-h-screen mx-auto p-6">
      <!-- Étape 1 : Type Visa -->
      <transition name="fade" mode="out-in">
        <section v-if="step === 1" key="step1">
          <h2 class="text-4xl font-bold text-center text-purple-600 mb-10">
            Sélectionnez le type de Visa
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              v-for="visa in visaTypes"
              :key="visa.id"
              @click="selectVisa(visa)"
              class="cursor-pointer bg-blue-100 rounded-xl p-6 shadow-sm hover:shadow-lg"
            >
              <h3 class="text-lg font-semibold text-blue-500">{{ visa.name }}</h3>
              <p class="text-gray-600 mt-2 text-sm">{{ visa.description }}</p>
            </div>
          </div>
        </section>
      </transition>

      <!-- Étape 2 : Choix pays -->
      <transition name="fade" mode="out-in">
        <div class="w-full flex justify-center" v-if="step === 2" key="step2">
          <section class="w-3xl items-center px-6">
            <!-- Titre -->
            <h2 class="text-4xl font-bold text-purple-600 mb-8 text-center w-full">
              Choisissez votre destination
            </h2>

            <!-- Message indicatif -->
            <p class="text-gray-600 text-center mb-8 text-sm w-full">
              🌍 Sélectionnez le pays dans lequel vous souhaitez voyager afin que nous puissions
              préparer votre demande de visa.
            </p>

            <!-- Sélecteur de pays -->
            <!-- Pays -->
            <div class="searchable-select" v-on-click-outside="closeCountryDropdown">
              <label class="block text-lg text-gray-700 font-bold mb-2"
                >Nom du pays <span class="text-orange-400">*</span></label
              >
              <input
                type="text"
                class="select-input"
                v-model="searchCountry"
                @focus="isCountryOpen = true"
                placeholder="🔍 Rechercher ou sélectionner un pays..."
              />
              <span class="arrow-down"></span>
              <ul v-if="isCountryOpen" class="options-list">
                <li v-if="filteredCountries.length === 0" class="no-results">Aucun résultat</li>
                <li
                  v-for="country in filteredCountries"
                  :key="country.id"
                  @click="selectCountry(country)"
                  class="option-item hover:cursor-pointer hover:bg-blue-50"
                >
                  {{ country.name }}
                </li>
              </ul>
            </div>

            <!-- Boutons -->
            <div class="flex w-full justify-between gap-8 mt-8">
              <button
                @click="prevStep"
                class="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl shadow hover:bg-gray-200 transition"
              >
                ← Retour
              </button>
              <button
                @click="submit"
                class="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-lg hover:from-orange-600 hover:to-orange-700 transition"
              >
                Soumettre la demande
              </button>
            </div>
          </section>
        </div>
      </transition>
    </div>
  </div>

  <!-- Résumé -->
  <div v-else class="w-full grid grid-cols-1 px-4 md:px-12 py-8 gap-12">
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
        class="ml-6 px-6 py-3 cursor-pointer text-white text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-400 rounded-full shadow-md hover:scale-105 hover:shadow-lg transition-all animate-gradient"
      >
        Lancer la procédure 🚀
      </button>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.4s,
    transform 0.4s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-x 4s ease infinite;
}
@keyframes gradient-x {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
.searchable-select {
  position: relative;
  width: 100%;
}
.select-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.9rem;
}
.arrow-down {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  pointer-events: none;
}
.options-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  margin-top: 2px;
  z-index: 50;
}
.option-item {
  padding: 8px 12px;
  cursor: pointer;
}
.option-item:hover {
  background-color: #f3f4f6;
}
.no-results {
  padding: 8px 12px;
  color: #9ca3af;
  font-size: 0.85rem;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
