<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useVisaStore } from '@/stores/visaStore'
import { useCountryStore } from '@/stores/countryStore'
import { useVisaTypeStore } from '@/stores/visaTypeStore'
import type { VisaFetch, VisaType } from '@/types/visa'
import { toastError, toastSuccess } from '@/utils/toastConfig'
import { useRouter } from 'vue-router'
import type { Country } from '@/types/country'
import { vOnClickOutside } from '@vueuse/components'

// -------------------------
// Formulaire
// -------------------------
const form = ref<VisaFetch>({
  country_name: '',
  visa_type_name: '',
  price_base: null,
  price_per_child: null,
  processing_duration_min: null,
  processing_duration_max: null,
  status_mat: 'single',
  age: 50,
  documents: [] as string[],
})
const countrys = ref<Country[]>([])
const visaTypes = ref<VisaType[]>([])

const visaStore = useVisaStore()
const countryStore = useCountryStore()
const visaTypeStore = useVisaTypeStore()
const router = useRouter()

// -------------------------
// Pays et types de visa
// -------------------------
onMounted(async () => {
  try {
    const resCountrys = await countryStore.getCountry()
    toastSuccess(resCountrys.message || 'Pays chargés avec succès')
    const resVisaType = await visaTypeStore.getVisaType()
    toastSuccess(resVisaType.message || 'Types de visa chargés avec succès')

    countrys.value = resCountrys.countrys || []
    visaTypes.value = resVisaType.visatypes || []
  } catch {
    toastError('Erreur de chargement des données')
  }
})

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
  form.value.country_name = country.name
  isCountryOpen.value = false
}

function closeCountryDropdown() {
  isCountryOpen.value = false
  if (selectedCountry.value) {
    searchCountry.value = selectedCountry.value.name
  }
}

// -------------------------
// Dropdown custom Visa Type
// -------------------------
const isVisaOpen = ref(false)
const searchVisaType = ref('')
const selectedVisaType = ref<VisaType | null>(null)

const filteredVisaTypes = computed(() => {
  if (!searchVisaType.value) return visaTypes.value
  return visaTypes.value.filter((v) =>
    v.name.toLowerCase().includes(searchVisaType.value.toLowerCase()),
  )
})

function selectVisaType(type: VisaType) {
  selectedVisaType.value = type
  searchVisaType.value = type.name
  form.value.visa_type_name = type.name
  isVisaOpen.value = false
}

function closeVisaDropdown() {
  isVisaOpen.value = false
  if (selectedVisaType.value) {
    searchVisaType.value = selectedVisaType.value.name
  }
}

// -------------------------
// Documents
// -------------------------
const allDocuments: Record<string, string[]> = {
  administratifs: [
    'Formulaire de demande de visa',
    'Passeport valide',
    'Photocopies du passeport',
    'Carte nationale d’identité',
    'Photographies d’identité',
    'Acte de naissance',
    'Acte de mariage',
    'Acte de divorce',
    'Livret de famille',
    'Autorisation parentale pour mineur',
  ],
  financiers: [
    'Preuve de paiement des frais de visa',
    'Relevés bancaires (3 à 6 derniers mois)',
    'Attestation de prise en charge / Lettre de sponsor',
    'Bulletins de salaire',
    'Attestation de travail',
    'Contrat de travail',
    'Déclaration d’impôts / Avis d’imposition',
    'Justificatifs de biens',
  ],
  voyage: [
    'Réservation d’hôtel ou attestation d’hébergement',
    'Lettre d’invitation',
    'Billet d’avion (aller-retour ou réservation)',
    'Assurance voyage',
    'Itinéraire de voyage détaillé',
  ],
  académiques_professionnels: [
    'Lettre de motivation',
    'Lettre d’admission (études)',
    'Preuve de paiement des frais de scolarité',
    'Diplômes / certificats / relevés de notes',
    'Lettre d’invitation d’une entreprise',
    'Preuve d’inscription à un congrès',
  ],
  médicaux_judiciaires: [
    'Certificat médical',
    'Carnet de vaccination',
    'Casier judiciaire récent',
    'Test de dépistage (VIH, tuberculose, COVID)',
  ],
  autres: [
    'Lettre d’engagement de retour au pays',
    'Attestation d’employeur de congé',
    'Certificat de scolarité (mineur)',
    'Preuve de ressources du garant',
    'Autorisation de sortie du territoire',
    'Lettre explicative (ex: changement de passeport)',
  ],
}

const availableDocuments = computed(() => {
  const result: Record<string, string[]> = {}
  for (const category in allDocuments) {
    result[category] = allDocuments[category].filter((doc) => !form.value.documents.includes(doc))
  }
  return result
})

const addDocument = (doc: string) => {
  if (!form.value.documents.includes(doc)) form.value.documents.push(doc)
}
const removeDocument = (index: number) => {
  form.value.documents.splice(index, 1)
}

// -------------------------
// Soumission
// -------------------------
const submitForm = async () => {
  try {
    const response = await visaStore.createVisa(form.value)
    toastSuccess(response.message)
    router.go(0)
  } catch (error: any) {
    toastError(error.response?.data?.message || "Erreur lors de l'enregistrement")
  }
}
</script>

<template>
  <div class="w-full min-h-screen mx-auto px-6 py-10 bg-white rounded-2xl shadow-lg">
    <h2 class="text-3xl md:text-4xl font-bold text-orange-400 text-center mb-8">
      Créer la liste des documents pour une demande
    </h2>

    <form @submit.prevent="submitForm" class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            class="option-item"
          >
            {{ country.name }}
          </li>
        </ul>
      </div>

      <!-- Type de visa -->
      <div class="searchable-select" v-on-click-outside="closeVisaDropdown">
        <label class="block text-lg text-gray-700 font-bold mb-2"
          >Type de visa <span class="text-orange-400">*</span></label
        >
        <input
          type="text"
          class="select-input"
          v-model="searchVisaType"
          @focus="isVisaOpen = true"
          placeholder="🔍 Rechercher ou sélectionner un type de visa..."
        />
        <span class="arrow-down"></span>
        <ul v-if="isVisaOpen" class="options-list">
          <li v-if="filteredVisaTypes.length === 0" class="no-results">Aucun résultat</li>
          <li
            v-for="type in filteredVisaTypes"
            :key="type.id"
            @click="selectVisaType(type)"
            class="option-item"
          >
            {{ type.name }}
          </li>
        </ul>
      </div>

      <!-- Prix de base -->
      <div>
        <label class="block text-lg text-gray-700 font-bold mb-2"
          >Prix de base <span class="text-orange-400">*</span></label
        >
        <input
          v-model="form.price_base"
          type="number"
          placeholder="Ex: 150"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-orange-400 text-sm"
        />
      </div>

      <!-- Prix par enfant -->
      <div v-if="form.status_mat !== 'single'">
        <label class="block text-lg text-gray-700 font-bold mb-2">Prix par enfant</label>
        <input
          v-model="form.price_per_child"
          type="number"
          placeholder="Ex: 50"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-orange-400 text-sm"
        />
      </div>

      <!-- Durées -->
      <div>
        <label class="block text-lg text-gray-700 font-bold mb-2"
          >Durée traitement min (jours)</label
        >
        <input
          v-model="form.processing_duration_min"
          type="number"
          placeholder="Ex: 7"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-400 text-sm"
        />
      </div>
      <div>
        <label class="block text-lg text-gray-700 font-bold mb-2"
          >Durée traitement max (jours)</label
        >
        <input
          v-model="form.processing_duration_max"
          type="number"
          placeholder="Ex: 15"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-400 text-sm"
        />
      </div>

      <!-- Statut matrimonial -->
      <div>
        <label class="block text-lg text-gray-700 font-bold mb-2"
          >Statut matrimonial <span class="text-orange-400">*</span></label
        >
        <select
          v-model="form.status_mat"
          class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-orange-400 text-sm"
        >
          <option disabled value="">-- Sélectionner --</option>
          <option value="single">Célibataire</option>
          <option value="married">Marié</option>
          <option value="divorced">Divorcé</option>
          <option value="widowed">Veuf/Veuve</option>
        </select>
      </div>

      <!-- Âge -->
      <div>
        <label class="block text-lg text-gray-700 font-bold mb-2"
          >Âge requis <span class="text-orange-400">*</span></label
        >
        <input
          v-model.number="form.age"
          type="range"
          min="0"
          max="100"
          class="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-orange-400"
        />
        <div class="text-xs text-gray-500 mt-1 text-right">{{ form.age }} ans</div>
      </div>

      <!-- Documents -->
      <div class="md:col-span-2 border rounded-lg p-4 bg-gray-50">
        <label class="block text-lg text-gray-700 font-bold mb-2"
          >Documents requis <span class="text-orange-400">*</span></label
        >
        <div v-for="(docs, category) in availableDocuments" :key="category" class="mb-4">
          <h3 class="text-sm font-semibold text-orange-500 mb-2 capitalize">
            {{ category.replace('_', ' ') }}
          </h3>
          <transition-group name="fade" tag="ul" class="flex flex-wrap gap-1">
            <li
              v-for="doc in docs"
              :key="doc"
              class="px-2 py-1 border border-orange-400 rounded-full flex items-center gap-1 cursor-pointer hover:bg-orange-100 text-xs"
              @click="addDocument(doc)"
            >
              <span class="text-orange-500 font-bold">+</span> {{ doc }}
            </li>
          </transition-group>
        </div>

        <transition-group name="fade" tag="ul" class="flex flex-wrap gap-1 mt-2">
          <li
            v-for="(doc, index) in form.documents"
            :key="doc"
            class="bg-gray-100 px-2 py-1 rounded-full flex items-center gap-1 text-xs"
          >
            {{ doc }}
            <button
              type="button"
              @click="removeDocument(index)"
              class="text-red-500 cursor-pointer"
            >
              x
            </button>
          </li>
        </transition-group>
      </div>

      <!-- Bouton submit -->
      <div class="md:col-span-2 flex justify-center mt-4">
        <button
          type="submit"
          class="bg-orange-400 text-white text-xl font-bold px-6 py-2 rounded-lg hover:bg-orange-600"
        >
          Enregistrer
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
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
