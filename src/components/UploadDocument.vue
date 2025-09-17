<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useVisaRequestStore } from '@/stores/visaRequestStore'
import { uploadFile } from '@/services/api'
import { useRouter } from 'vue-router'

// -------------------------
// Interfaces
// -------------------------
interface Validation {
  required: true
  fileTypes: string[]
  maxSizeMB: number
}

interface DocumentItem {
  name: string
  guide: string
  validation: Validation
}

interface DocumentError {
  [key: string]: string | null
}

// -------------------------
// Stores & Router
// -------------------------
const router = useRouter()
const visaRequestStore = useVisaRequestStore()
const userStore = useUserStore()

// -------------------------
// État local
// -------------------------
const uploadedFiles = ref<Record<string, File | null>>({})
const docErrors = ref<DocumentError>({})
const documentRecieve = ref<string[]>([])

// Récupération documents existants depuis localStorage
const storedVisa = localStorage.getItem('visa')
if (storedVisa) {
  const parsedVisa = JSON.parse(storedVisa)
  documentRecieve.value = parsedVisa.documents || []
}

// -------------------------
// Constante des documents attendus
// -------------------------
const allDocuments: Record<string, DocumentItem[]> = {
  administratifs: [
    {
      name: 'Formulaire de demande de visa',
      guide: 'Télécharger le formulaire officiel sur le site de l’ambassade.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
    {
      name: 'Passeport valide',
      guide: 'Passeport valable au moins 6 mois après la date de retour.',
      validation: { required: true, fileTypes: ['pdf', 'jpg', 'png'], maxSizeMB: 5 },
    },
    {
      name: 'Photocopies du passeport',
      guide: 'Toutes les pages importantes (photo, visas, tampons).',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 3 },
    },
    {
      name: 'Carte nationale d’identité',
      guide: 'Copie recto-verso de la CNI en cours de validité.',
      validation: { required: true, fileTypes: ['pdf', 'jpg', 'png'], maxSizeMB: 3 },
    },
    {
      name: 'Photographies d’identité',
      guide: 'Photos récentes aux normes biométriques (format passeport).',
      validation: { required: true, fileTypes: ['jpg', 'png'], maxSizeMB: 2 },
    },
    {
      name: 'Acte de naissance',
      guide: 'Copie intégrale de l’acte de naissance.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
    {
      name: 'Acte de mariage',
      guide: 'Copie intégrale en cas de mariage.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
    {
      name: 'Acte de divorce',
      guide: 'Jugement de divorce le cas échéant.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
    {
      name: 'Livret de famille',
      guide: 'Pages concernant le demandeur et les enfants.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 3 },
    },
    {
      name: 'Autorisation parentale pour mineur',
      guide: 'Lettre signée par les parents + copie de leurs pièces d’identité.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
  ],
  financiers: [
    {
      name: 'Preuve de paiement des frais de visa',
      guide: 'Reçu ou justificatif du paiement effectué.',
      validation: { required: true, fileTypes: ['pdf', 'jpg'], maxSizeMB: 2 },
    },
    {
      name: 'Relevés bancaires (3 à 6 derniers mois)',
      guide: 'Scanner vos relevés bancaires en PDF lisible.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 10 },
    },
    {
      name: 'Attestation de prise en charge / Lettre de sponsor',
      guide: 'Lettre signée + pièce d’identité du garant.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 5 },
    },
    {
      name: 'Bulletins de salaire',
      guide: '3 derniers bulletins de salaire du demandeur.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 5 },
    },
    {
      name: 'Attestation de travail',
      guide: 'Lettre de l’employeur confirmant le poste et l’ancienneté.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 3 },
    },
    {
      name: 'Contrat de travail',
      guide: 'Copie signée de votre contrat de travail.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 5 },
    },
    {
      name: 'Déclaration d’impôts / Avis d’imposition',
      guide: 'Dernière déclaration ou avis officiel.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 5 },
    },
    {
      name: 'Justificatifs de biens',
      guide: 'Titres de propriété, certificats de véhicule, etc.',
      validation: { required: true, fileTypes: ['pdf', 'jpg'], maxSizeMB: 5 },
    },
  ],
  voyage: [
    {
      name: 'Réservation d’hôtel ou attestation d’hébergement',
      guide: 'Réservation confirmée ou lettre de l’hébergeant.',
      validation: { required: true, fileTypes: ['pdf', 'jpg'], maxSizeMB: 3 },
    },
    {
      name: 'Lettre d’invitation',
      guide: 'Lettre officielle de la personne ou institution qui vous invite.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 3 },
    },
    {
      name: 'Billet d’avion (aller-retour ou réservation)',
      guide: 'Billet confirmé ou réservation avec dates précises.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 5 },
    },
    {
      name: 'Assurance voyage',
      guide: 'Attestation d’assurance couvrant toute la durée du séjour.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
    {
      name: 'Itinéraire de voyage détaillé',
      guide: 'Plan de séjour avec lieux et dates.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
  ],
  académiques_professionnels: [
    {
      name: 'Lettre de motivation',
      guide: 'Lettre expliquant les raisons de la demande et le projet.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
    {
      name: 'Lettre d’admission (études)',
      guide: 'Lettre officielle de l’université ou école.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 3 },
    },
    {
      name: 'Preuve de paiement des frais de scolarité',
      guide: 'Reçu de paiement de l’établissement scolaire.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 3 },
    },
    {
      name: 'Diplômes / certificats / relevés de notes',
      guide: 'Copies certifiées conformes des diplômes obtenus.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 10 },
    },
    {
      name: 'Lettre d’invitation d’une entreprise',
      guide: 'Lettre signée précisant l’objet du voyage professionnel.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 3 },
    },
    {
      name: 'Preuve d’inscription à un congrès',
      guide: 'Justificatif officiel de l’inscription.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 3 },
    },
  ],
  médicaux_judiciaires: [
    {
      name: 'Certificat médical',
      guide: 'Certificat signé par un médecin agréé.',
      validation: { required: true, fileTypes: ['pdf', 'jpg'], maxSizeMB: 2 },
    },
    {
      name: 'Carnet de vaccination',
      guide: 'Pages attestant des vaccinations obligatoires.',
      validation: { required: true, fileTypes: ['pdf', 'jpg', 'png'], maxSizeMB: 3 },
    },
    {
      name: 'Casier judiciaire récent',
      guide: 'Extrait du casier judiciaire de moins de 3 mois.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
    {
      name: 'Test de dépistage (VIH, tuberculose, COVID)',
      guide: 'Résultats des tests récents exigés.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
  ],
  autres: [
    {
      name: 'Lettre d’engagement de retour au pays',
      guide: 'Déclaration signée du demandeur.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
    {
      name: 'Attestation d’employeur de congé',
      guide: 'Lettre signée confirmant la durée du congé.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
    {
      name: 'Certificat de scolarité (mineur)',
      guide: 'Certificat récent de l’établissement fréquenté.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
    {
      name: 'Preuve de ressources du garant',
      guide: 'Attestation bancaire, fiches de paie ou autres justificatifs.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 5 },
    },
    {
      name: 'Autorisation de sortie du territoire',
      guide: 'Document officiel pour les mineurs voyageant seuls.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
    {
      name: 'Lettre explicative (ex: changement de passeport)',
      guide: 'Lettre justifiant une situation particulière.',
      validation: { required: true, fileTypes: ['pdf'], maxSizeMB: 2 },
    },
  ],
} as const

// -------------------------
// Filtrage documents requis
// -------------------------
const requiredDocs = computed(() => {
  const result: Record<string, DocumentItem[]> = {}
  for (const category in allDocuments) {
    const filtered = allDocuments[category].filter(doc => documentRecieve.value.includes(doc.name))
    if (filtered.length) result[category] = filtered
  }
  return result
})

// -------------------------
// Gestion fichiers
// -------------------------
function onFileChange(event: Event, docName: string) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    uploadedFiles.value[docName] = input.files[0]
    docErrors.value[docName] = null
  }
}

// -------------------------
// Validation fichier
// -------------------------
function validateFile(file: File, doc: DocumentItem): string | null {
  const ext = file.name.split('.').pop()!.toLowerCase()
  if (!doc.validation.fileTypes.includes(ext)) return `Format invalide (${ext}), attendu: ${doc.validation.fileTypes.join(', ')}`
  if (file.size / 1024 / 1024 > doc.validation.maxSizeMB) return `Taille trop grande (> ${doc.validation.maxSizeMB} MB)`
  return null
}

// -------------------------
// Soumission des fichiers
// -------------------------
async function submitAll() {
  const visaRequestId = visaRequestStore.visaRequestId
  if (!visaRequestId) {
    alert('ID de la demande de visa manquant. Veuillez recommencer le processus.')
    return router.push({ name: 'custom.visarequest.create' })
  }

  let hasErrors = false
  console.log('Soumission des fichiers pour la demande ID:', visaRequestId)

  for (const category in requiredDocs.value) {
    for (const doc of requiredDocs.value[category]) {
      const file = uploadedFiles.value[doc.name]

      if (!file && doc.validation.required) {
        docErrors.value[doc.name] = `${doc.name} est requis`
        hasErrors = true
        continue
      }

      if (file) {
        const validationError = validateFile(file, doc)
        if (validationError) {
          docErrors.value[doc.name] = validationError
          hasErrors = true
          continue
        }

        try {
          const formData = new FormData()
          formData.append('visa_request_id', String(visaRequestId))
          formData.append('name', doc.name)
          formData.append('document_file', file)

          await uploadFile('/document/store', formData)
          console.log(`${doc.name} uploadé avec succès`)
        } catch (err) {
          console.error(`Erreur lors de l’envoi de ${doc.name}:`, err)
          docErrors.value[doc.name] = `Erreur lors de l’envoi`
          hasErrors = true
        }
      }
    }
  }

  if (!hasErrors) {
    router.push({ name: 'custom.visarequest.show.get', params: { id: visaRequestId } })
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
    <div class="w-full max-w-5xl">
      <h1 class="text-4xl font-bold mb-12 text-purple-600 text-center">
        📑 Upload des documents requis
      </h1>

      <div v-for="(docs, category) in requiredDocs" :key="category" class="mb-12">
        <h2 class="text-2xl font-semibold mb-6 text-orange-500 capitalize border-b border-gray-300 pb-2">
          {{ category.replace(/_/g, ' ') }}
        </h2>

        <div class="grid gap-6 md:grid-cols-2">
          <div v-for="doc in docs" :key="doc.name" class="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition flex flex-col">
            <h3 class="text-lg font-semibold mb-2 text-gray-800">{{ doc.name }}</h3>
            <p class="text-gray-500 mb-4 text-sm italic">
              {{ doc.guide }} ( max {{ doc.validation.maxSizeMB }} Mo,
              Types: <span v-for="(type,i) in doc.validation.fileTypes" :key="i">{{ type }}{{ i<doc.validation.fileTypes.length-1 ? ', ' : '' }}</span> )
            </p>

            <input type="file" @change="onFileChange($event, doc.name)" class="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200" />

            <p v-if="docErrors[doc.name]" class="text-red-500 text-sm mt-2">{{ docErrors[doc.name] }}</p>
          </div>
        </div>
      </div>

      <div class="flex justify-center mt-6">
        <button @click="submitAll" class="bg-purple-600 hover:bg-purple-700 text-white px-10 py-4 rounded-2xl shadow-md font-bold transition duration-200">
          🚀 Soumettre les documents
        </button>
      </div>
    </div>
  </div>
</template>
