<template>
  <div class="p-6 w-full">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Tableau de bord</h1>

    <div class="bg-white p-6 rounded-lg shadow mb-8">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Statut de votre demande de visa</h2>
      <div
        v-if="procedureStatus.status === 'En cours'"
        class="flex items-center text-blue-500 font-medium"
      >
        <font-awesome-icon icon="spinner" class="animate-spin mr-2" />
        <span>Statut : {{ procedureStatus.status }}</span>
      </div>
      <div
        v-else-if="procedureStatus.status === 'En attente de documents'"
        class="flex items-center text-orange-400 font-medium"
      >
        <font-awesome-icon icon="exclamation-triangle" class="mr-2" />
        <span>Statut : {{ procedureStatus.status }} - {{ procedureStatus.message }}</span>
      </div>
      <div
        v-else-if="procedureStatus.status === 'Approuvé'"
        class="flex items-center text-green-500 font-medium"
      >
        <font-awesome-icon icon="check-circle" class="mr-2" />
        <span
          >Statut : {{ procedureStatus.status }} - Votre rendez-vous a été fixé le
          {{ procedureStatus.rendezVousDate }}</span
        >
      </div>
      <div v-else class="flex items-center text-gray-500 font-medium">
        <font-awesome-icon icon="info-circle" class="mr-2" />
        <span>Statut : {{ procedureStatus.status }}</span>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-xl font-semibold text-gray-700 mb-4">Historique des transactions</h2>
      <div v-if="transactions.length === 0" class="text-center text-gray-500 py-8">
        <font-awesome-icon icon="file-invoice-dollar" class="text-4xl mb-2" />
        <p>Aucune transaction enregistrée pour le moment.</p>
      </div>
      <ul v-else class="space-y-4">
        <li
          v-for="transaction in transactions"
          :key="transaction.id"
          class="flex justify-between items-center border-b pb-4 last:border-b-0 last:pb-0"
        >
          <div>
            <p class="font-medium text-gray-900">{{ transaction.description }}</p>
            <p class="text-sm text-gray-500">{{ transaction.date }}</p>
          </div>
          <div
            :class="{
              'text-green-500 font-semibold': transaction.type === 'Paiement',
              'text-red-500 font-semibold': transaction.type === 'Remboursement',
            }"
          >
            <span>{{ transaction.amount }} XAF</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faSpinner,
  faExclamationTriangle,
  faCheckCircle,
  faInfoCircle,
  faFileInvoiceDollar,
} from '@fortawesome/free-solid-svg-icons'

// Ajouter les icônes à la bibliothèque
library.add(faSpinner, faExclamationTriangle, faCheckCircle, faInfoCircle, faFileInvoiceDollar)

// Données fictives pour le statut de la procédure
const procedureStatus = ref({
  status: 'En attente de documents',
  message: 'Veuillez télécharger les documents manquants pour continuer.',
  rendezVousDate: null,
})

// Données fictives pour les transactions
const transactions = ref([
  {
    id: 1,
    date: '15/08/2025',
    description: 'Frais de traitement du dossier',
    amount: 50000,
    type: 'Paiement',
  },
  {
    id: 2,
    date: '10/08/2025',
    description: 'Frais de service Visa Schengen',
    amount: 150000,
    type: 'Paiement',
  },
])
</script>
