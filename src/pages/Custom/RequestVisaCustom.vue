<!-- src/pages/VisaRequestPage.vue -->
<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import axios from 'axios'

// Types
type Gender = 'male' | 'female'
type StatusMat = 'single' | 'married' | 'divorced' | 'widowed'
interface Custom {
  id: number
  name: string
  email: string
  phone: string
  password: string
  role?: string
  first_name: string
  last_name: string
  gender: Gender
  date_of_birth: string
  place_of_birth: string
  status_mat: StatusMat
  country_name: string
}

// États
const step = ref(1)
const countries = ref<Array<{ id: number; name: string }>>([])
const visaTypes = ref<Array<{ id: number; name: string }>>([])
const selectedCountry = ref<{ id: number; name: string } | null>(null)
const selectedVisaType = ref<{ id: number; name: string } | null>(null)

// Formulaire infos personnelles
const form = reactive<Partial<Custom>>({
  email: '',
  phone: '',
  first_name: '',
  last_name: '',
  gender: '' as Gender,
  date_of_birth: '',
  place_of_birth: '',
  status_mat: '' as StatusMat,
  country_name: '',
})

const errors = ref<Record<string, string>>({})

// Récupération des pays
axios.get('/api/countries').then((res) => (countries.value = res.data))

// Récupération des types de visa
watch(selectedCountry, async (val) => {
  if (val) {
    form.country_name = val.name
    const res = await axios.get(`/api/countries/${val.id}/visa-types`)
    visaTypes.value = res.data
  }
})

// Validation simple
const validateStep = () => {
  errors.value = {}
  if (step.value === 1 && !selectedCountry.value) {
    errors.value.country_name = 'Veuillez choisir un pays'
    return false
  }
  if (step.value === 2 && !selectedVisaType.value) {
    errors.value.visaType = 'Veuillez choisir un type de visa'
    return false
  }
  if (step.value === 3) {
    const requiredFields = [
      'email',
      'phone',
      'first_name',
      'last_name',
      'gender',
      'date_of_birth',
      'place_of_birth',
      'status_mat',
    ]
    let valid = true
    requiredFields.forEach((f) => {
      if (!form[f as keyof Custom]) {
        errors.value[f] = 'Ce champ est requis'
        valid = false
      }
    })
    return valid
  }
  return true
}

const nextStep = () => {
  if (validateStep()) step.value++
}
const prevStep = () => step.value--

const submit = async () => {
  if (!validateStep()) return
  try {
    const payload: Custom = {
      id: 0, // à gérer côté backend
      name: form.first_name + ' ' + form.last_name,
      email: form.email!,
      phone: form.phone!,
      password: '', // optionnel si création via API
      role: form.role,
      first_name: form.first_name!,
      last_name: form.last_name!,
      gender: form.gender!,
      date_of_birth: form.date_of_birth!,
      place_of_birth: form.place_of_birth!,
      status_mat: form.status_mat!,
      country_name: form.country_name!,
    }
    const res = await axios.post('/api/visa-requests', payload)
    alert('Demande enregistrée !')
    console.log(res.data)
  } catch (err: any) {
    if (err.response?.data?.message) {
      alert(JSON.stringify(err.response.data.message))
    } else {
      alert('Erreur serveur')
    }
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-8">
    <h1 class="text-2xl font-bold mb-6">Demande de Visa</h1>

    <!-- Étape 1 : Pays -->
    <div v-if="step === 1">
      <label class="block mb-2 font-medium">Pays de destination :</label>
      <select v-model="selectedCountry" class="border p-2 rounded w-full">
        <option value="">-- Sélectionnez un pays --</option>
        <option v-for="c in countries" :key="c.id" :value="c">{{ c.name }}</option>
      </select>
      <p v-if="errors.country_name" class="text-red-500 mt-1">{{ errors.country_name }}</p>
      <button @click="nextStep" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Suivant
      </button>
    </div>

    <!-- Étape 2 : Type de visa -->
    <div v-if="step === 2">
      <label class="block mb-2 font-medium">Type de visa :</label>
      <select v-model="selectedVisaType" class="border p-2 rounded w-full">
        <option value="">-- Sélectionnez un type de visa --</option>
        <option v-for="v in visaTypes" :key="v.id" :value="v">{{ v.name }}</option>
      </select>
      <p v-if="errors.visaType" class="text-red-500 mt-1">{{ errors.visaType }}</p>
      <div class="mt-4 flex justify-between">
        <button @click="prevStep" class="px-4 py-2 bg-gray-300 rounded">Retour</button>
        <button @click="nextStep" class="px-4 py-2 bg-blue-500 text-white rounded">Suivant</button>
      </div>
    </div>

    <!-- Étape 3 : Infos personnelles -->
    <div v-if="step === 3">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Email</label>
          <input type="email" v-model="form.email" class="border p-2 rounded w-full" />
          <p v-if="errors.email" class="text-red-500">{{ errors.email }}</p>
        </div>
        <div>
          <label>Téléphone</label>
          <input type="text" v-model="form.phone" class="border p-2 rounded w-full" />
          <p v-if="errors.phone" class="text-red-500">{{ errors.phone }}</p>
        </div>
        <div>
          <label>Prénom</label>
          <input type="text" v-model="form.first_name" class="border p-2 rounded w-full" />
          <p v-if="errors.first_name" class="text-red-500">{{ errors.first_name }}</p>
        </div>
        <div>
          <label>Nom</label>
          <input type="text" v-model="form.last_name" class="border p-2 rounded w-full" />
          <p v-if="errors.last_name" class="text-red-500">{{ errors.last_name }}</p>
        </div>
        <div>
          <label>Genre</label>
          <select v-model="form.gender" class="border p-2 rounded w-full">
            <option value="">-- Sélectionnez --</option>
            <option value="male">Homme</option>
            <option value="female">Femme</option>
          </select>
          <p v-if="errors.gender" class="text-red-500">{{ errors.gender }}</p>
        </div>
        <div>
          <label>Date de naissance</label>
          <input type="date" v-model="form.date_of_birth" class="border p-2 rounded w-full" />
          <p v-if="errors.date_of_birth" class="text-red-500">{{ errors.date_of_birth }}</p>
        </div>
        <div>
          <label>Lieu de naissance</label>
          <input type="text" v-model="form.place_of_birth" class="border p-2 rounded w-full" />
          <p v-if="errors.place_of_birth" class="text-red-500">{{ errors.place_of_birth }}</p>
        </div>
        <div>
          <label>Statut matrimonial</label>
          <select v-model="form.status_mat" class="border p-2 rounded w-full">
            <option value="">-- Sélectionnez --</option>
            <option value="single">Célibataire</option>
            <option value="married">Marié(e)</option>
            <option value="divorced">Divorcé(e)</option>
            <option value="widowed">Veuf/Veuve</option>
          </select>
          <p v-if="errors.status_mat" class="text-red-500">{{ errors.status_mat }}</p>
        </div>
      </div>

      <div class="mt-4 flex justify-between">
        <button @click="prevStep" class="px-4 py-2 bg-gray-300 rounded">Retour</button>
        <button @click="submit" class="px-4 py-2 bg-green-500 text-white rounded">Soumettre</button>
      </div>
    </div>
  </div>
</template>
