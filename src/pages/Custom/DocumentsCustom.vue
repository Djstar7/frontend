<script setup lang="ts">
import { ref } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faPlusCircle,
  faFolderOpen,
  faFilePdf,
  faFileImage,
  faFileWord,
  faFileAlt,
  faEye,
  faTrash,
} from '@fortawesome/free-solid-svg-icons'

// Ajouter les icônes à la bibliothèque
library.add(
  faPlusCircle,
  faFolderOpen,
  faFilePdf,
  faFileImage,
  faFileWord,
  faFileAlt,
  faEye,
  faTrash,
)

// Données fictives des documents
const documents = ref([
  { id: 1, name: 'Passeport.pdf', type: 'pdf', uploadDate: '2025-08-18', status: 'Validé' },
  {
    id: 2,
    name: "Photo d'identité.jpeg",
    type: 'image',
    uploadDate: '2025-08-18',
    status: 'En revue',
  },
  {
    id: 3,
    name: 'Justificatif de domicile.docx',
    type: 'word',
    uploadDate: '2025-08-19',
    status: 'En attente',
  },
  {
    id: 4,
    name: 'Formulaire de demande.pdf',
    type: 'pdf',
    uploadDate: '2025-08-19',
    status: 'Rejeté',
  },
])

// Fonction pour déterminer l'icône du document en fonction de son type
const getDocumentIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return 'file-pdf'
    case 'image':
      return 'file-image'
    case 'word':
      return 'file-word'
    default:
      return 'file-alt'
  }
}

// Fonction pour ouvrir la modale de téléversement
const openUploadModal = () => {
  alert("Fonctionnalité d'ouverture de la modale de téléversement en cours de développement.")
  // Ici, vous devrez émettre un événement ou utiliser un store pour ouvrir une modale
  // par exemple : emit('open-upload-modal');
}

// Fonction pour supprimer un document
const deleteDocument = (documentId: number) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
    // Logique de suppression ici (appel API)
    console.log(`Suppression du document avec l'ID : ${documentId}`)
    // Mettre à jour la liste après la suppression
    documents.value = documents.value.filter((doc) => doc.id !== documentId)
  }
}
</script>
<template>
  <div class="p-6 w-full">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Mes documents envoyés</h1>

    <div class="mb-6 flex justify-start">
      <button
        @click="openUploadModal"
        class="bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
      >
        <font-awesome-icon icon="plus-circle" class="mr-2" />
        Ajouter un document
      </button>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <div v-if="documents.length === 0" class="text-center text-gray-500 py-8">
        <font-awesome-icon icon="folder-open" class="text-4xl mb-2" />
        <p>Aucun document n'a été téléversé pour le moment.</p>
        <p class="mt-2">Cliquez sur "Ajouter un document" pour commencer.</p>
      </div>

      <div v-else>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nom du document
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date d'envoi
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Statut
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="document in documents" :key="document.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <font-awesome-icon
                    :icon="getDocumentIcon(document.type)"
                    class="mr-2 text-lg text-gray-600"
                  />
                  <span class="font-medium text-gray-900">{{ document.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ document.uploadDate }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    { 'bg-yellow-100 text-yellow-800': document.status === 'En attente' },
                    { 'bg-purple-100 text-purple-800': document.status === 'En revue' },
                    { 'bg-orange-100 text-orange-800': document.status === 'Rejeté' },
                    { 'bg-green-100 text-green-800': document.status === 'Validé' },
                  ]"
                >
                  {{ document.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a href="#" class="text-blue-500 hover:text-blue-600 mr-4">
                  <font-awesome-icon icon="eye" />
                </a>
                <a
                  href="#"
                  class="text-red-500 hover:text-red-600"
                  @click.prevent="deleteDocument(document.id)"
                >
                  <font-awesome-icon icon="trash" />
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
