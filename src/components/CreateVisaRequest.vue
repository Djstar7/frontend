<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { toastError, toastSuccess } from '@/utils/toastConfig'
import type { Country } from '@/types/country'
import type { Visa, VisaType } from '@/types/visa'
import { useVisaTypeStore } from '@/stores/visaTypeStore'
import { useCountryStore } from '@/stores/countryStore'
import { useVisaStore } from '@/stores/visaStore'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import CreateProfilCustom from './CreateProfilCustom.vue'

// ---------------- ÉTATS ----------------
const step = ref(1)
const isOpenModalCreateProfil = ref(false)
const completedSteps = ref<number[]>([])

const countrys = ref<Country[]>([])
const visaTypes = ref<VisaType[]>([])
const selectedVisaType = ref<VisaType | null>(null)

const storedUser = localStorage.getItem('user')
if (!storedUser) throw new Error('Aucun utilisateur trouvé')
const { id } = JSON.parse(storedUser)

const visatypeStore = useVisaTypeStore()
const countryStore = useCountryStore()
const visaStore = useVisaStore()
const userStore = useUserStore()
const router = useRouter()

// ---------------- FETCH DATA ----------------
const loadData = async () => {
  try {
    const resCountrys = await countryStore.getCountry()
    toastSuccess(resCountrys.message || 'Pays chargés avec succès')
    const resVisaType = await visatypeStore.getVisaType()
    toastSuccess(resVisaType.message || 'Types de visa chargés avec succès')

    countrys.value = resCountrys.countrys || []
    visaTypes.value = resVisaType.visatypes || []

    // 👉 Vérification du profil utilisateur dès le chargement
    if (!userStore.profil) {
      console.warn('🚨 Aucun profil utilisateur trouvé → ouverture de la modal')
      isOpenModalCreateProfil.value = true
    }
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

const submit = async () => {
  try {
    if (!selectedCountry.value || !selectedVisaType.value) {
      return toastError('Veuillez sélectionner un pays et un type de visa')
    }

    const payload: Visa = {
      user_id: id,
      country_dest_name: selectedCountry.value.name,
      visa_type_name: selectedVisaType.value.name,
    }
    const res = await visaStore.createStoreVisa(payload)
    if (!res) throw new Error('Erreur lors de la création du visa')

    toastSuccess('Visa créé avec succès')

    // 👉 Vérification avant redirection
    if (!userStore.profil) {
      isOpenModalCreateProfil.value = true
      return
    }

    router.push({ name: 'custom.visarequest.create.view' })
    return res
  } catch (err: any) {
    toastError(err?.message || 'Erreur lors de la création du visa')
    return null
  }
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
  <div class="min-h-screen py-2 px-1 w-full bg-gradient-to-br from-blue-50 to-gray-100">
    <!-- Stepper -->
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

    <!-- Contenu -->
    <div class="w-full min-h-screen mx-auto p-6">
      <!-- Étape 1 -->
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

      <!-- Étape 2 -->
      <transition name="fade" mode="out-in">
        <div class="w-full flex justify-center" v-if="step === 2" key="step2">
          <section class="w-3xl items-center px-6">
            <h2 class="text-4xl font-bold text-purple-600 mb-8 text-center w-full">
              Choisissez votre destination
            </h2>
            <p class="text-gray-600 text-center mb-8 text-sm w-full">
              Sélectionnez le pays dans lequel vous souhaitez voyager afin que nous puissions
              préparer votre demande de visa.
            </p>

            <!-- Sélecteur de pays -->
            <div class="searchable-select" v-on-click-outside="closeCountryDropdown">
              <label class="block text-lg text-gray-700 font-bold mb-2">
                Nom du pays <span class="text-orange-400">*</span>
              </label>
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

    <!-- MODAL CREATE PROFIL -->
    <div
      v-if="isOpenModalCreateProfil"
      class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
    >
      <div class="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8">
        <button
          @click="isOpenModalCreateProfil = false"
          class="absolute top-4 right-4 text-red-500 hover:text-red-600 cursor-pointer text-xl"
        >
          ✕
        </button>
        <CreateProfilCustom @created="isOpenModalCreateProfil = false" />
      </div>
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
</style>
