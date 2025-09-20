<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDocumentStore } from '@/stores/documentStore'

// Interface Document
interface Document {
  id?: number
  visa_request_id: number
  name: string
  file_path: string
  is_validated: boolean
}

const route = useRoute()
const documentStore = useDocumentStore()

const documents = ref<Document[]>([])
const selectedDoc = ref<Document | null>(null)
const loading = ref(true)

// Zoom, rotation & PDF
const zoomLevel = ref(1)
const rotation = ref(0)
const cursor = ref({ x: 0, y: 0 })
const isZooming = ref(false)

// Base URL Laravel storage
const baseStorageUrl = 'http://localhost:8000/storage'

// Récupération des documents
const fetchDocuments = async () => {
  try {
    const id = Number(route.params.visaRequestId)
    const res = await documentStore.showDocumentByVisaRequest(id)
    documents.value = res.documents
    console.log('data recu : ', documents.value)
    if (documents.value.length > 0) selectedDoc.value = documents.value[0]
  } finally {
    loading.value = false
  }
}

// Sélection d’un document
const selectDocument = (doc: Document) => {
  selectedDoc.value = doc
  zoomLevel.value = 1
  rotation.value = 0
}

// Zoom et rotation (images uniquement)
const handleZoomIn = () => (zoomLevel.value = Math.min(zoomLevel.value + 0.25, 5))
const handleZoomOut = () => (zoomLevel.value = Math.max(zoomLevel.value - 0.25, 0.5))
const handleRotate = () => (rotation.value = (rotation.value + 90) % 360)

// Suivi du curseur pour images
const handleMouseMove = (e: MouseEvent, container: HTMLDivElement) => {
  const rect = container.getBoundingClientRect()
  cursor.value.x = ((e.clientX - rect.left) / rect.width) * 100
  cursor.value.y = ((e.clientY - rect.top) / rect.height) * 100
}
const validateDocument = async () => {
  if (!selectedDoc.value) return
  try {
    await documentStore.editDocument(selectedDoc.value.id!, { is_validated: true }) // ✅ true
    selectedDoc.value.is_validated = true
    console.log('Document validé ✅', selectedDoc.value)
  } catch (e) {
    console.error('Erreur validation document ❌', e)
  }
}

const rejectDocument = async () => {
  if (!selectedDoc.value) return
  try {
    await documentStore.editDocument(selectedDoc.value.id!, { is_validated: false }) // ✅ false
    selectedDoc.value.is_validated = false
    console.log('Document rejeté ❌', selectedDoc.value)
  } catch (e) {
    console.error('Erreur rejet document ❌', e)
  }
}

onMounted(fetchDocuments)
</script>

<template>
  <div class="w-full max-w-6xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">Documents associés</h2>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-10">
      <span class="animate-pulse text-purple-600">Chargement...</span>
    </div>

    <!-- Viewer -->
    <div v-else class="bg-white shadow-lg rounded-xl p-4">
      <div class="relative">
        <!-- Toolbar -->
        <div class="absolute top-4 right-4 flex gap-2 z-10">
          <button @click="handleZoomOut" class="p-2 rounded bg-gray-100 hover:bg-gray-200 shadow">
            ➖
          </button>
          <button @click="handleZoomIn" class="p-2 rounded bg-gray-100 hover:bg-gray-200 shadow">
            +
          </button>
          <button @click="handleRotate" class="p-2 rounded bg-gray-100 hover:bg-gray-200 shadow">
            🔄
          </button>
        </div>

        <!-- Main Content -->
        <div
          v-if="selectedDoc"
          class="h-[600px] flex justify-center items-center bg-gray-50 rounded-xl overflow-hidden relative"
          @mouseenter="isZooming = true"
          @mouseleave="isZooming = false"
          @mousemove="handleMouseMove($event, $event.currentTarget as HTMLDivElement)"
        >
          <!-- PDF (scroll only) -->
          <iframe
            v-if="selectedDoc.file_path.endsWith('.pdf')"
            :src="`${baseStorageUrl}/${selectedDoc.file_path}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`"
            class="w-full h-full rounded-xl border"
            style="overflow: auto"
            sandbox="allow-scripts allow-same-origin allow-popups"
          ></iframe>

          <!-- Image -->
          <img
            v-else
            :src="`${baseStorageUrl}/${selectedDoc.file_path}`"
            :alt="selectedDoc.name"
            class="max-w-full max-h-full object-contain transition-transform duration-150"
            :style="{
              transformOrigin: cursor.x + '% ' + cursor.y + '%',
              transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
            }"
          />

          <!-- Validation Buttons -->
          <div class="absolute bottom-4 right-4 flex gap-2 z-10">
            <button
              @click="validateDocument"
              class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 shadow"
            >
              Valider
            </button>
            <button
              @click="rejectDocument"
              class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 shadow"
            >
              Rejeter
            </button>
          </div>
        </div>

        <div v-else class="text-gray-400 h-[600px] flex items-center justify-center">
          Aucun document disponible
        </div>
      </div>

      <!-- Thumbnails -->
      <div class="flex mt-4 gap-3 overflow-x-auto pb-2">
        <div
          v-for="doc in documents"
          :key="doc.id || doc.visa_request_id + doc.name"
          class="w-24 h-24 flex-shrink-0 rounded-lg border cursor-pointer overflow-hidden transition-all relative"
          :class="
            selectedDoc?.file_path === doc.file_path
              ? 'ring-2 ring-orange-500 shadow-lg'
              : 'hover:ring-2 hover:ring-blue-400'
          "
          @click="selectDocument(doc)"
        >
          <img
            v-if="!doc.file_path.endsWith('.pdf')"
            :src="`${baseStorageUrl}/${doc.file_path}`"
            :alt="doc.name"
            class="w-full h-full object-cover"
            loading="lazy"
          />
          <div
            v-else
            class="flex items-center justify-center w-full h-full bg-purple-600 text-white text-xs font-bold"
          >
            PDF
          </div>
          <div
            v-if="selectedDoc?.file_path === doc.file_path"
            class="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white"
          />
        </div>
      </div>

      <!-- Info document -->
      <div v-if="selectedDoc" class="mt-4 text-center">
        <h3 class="font-medium text-gray-800">{{ selectedDoc.name }}</h3>
        <p class="text-sm text-gray-500">
          Zoom: {{ Math.round(zoomLevel * 100) }}% | Rotation: {{ rotation }}°
        </p>
        <p class="text-sm mt-1">
          Validation :
          <span
            :class="
              selectedDoc.is_validated ? 'text-green-600 font-bold' : 'text-red-500 font-bold'
            "
          >
            {{ selectedDoc.is_validated ? 'Validé' : 'Non validé' }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>
