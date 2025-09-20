<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Custom } from '@/types/user'

const props = defineProps<{ user: Custom }>()
const router = useRouter()

// Initiales sécurisées
const initials = computed(() => {
  const { first_name, last_name } = props.user
  return ((first_name?.charAt(0) || '') + (last_name?.charAt(0) || '')).toUpperCase()
})

// Nom complet (fallback sur user.name)
const fullName = computed(() => {
  return props.user.first_name && props.user.last_name
    ? `${props.user.first_name} ${props.user.last_name}`
    : props.user.name
})

// Formatage simple de date
const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Redirection vers la liste des demandes d’un utilisateur
const goToVisaRequests = () => {
  router.push({ name: 'agent.users.show.visarequest', params: { userId: props.user.id } })
}
</script>

<template>
  <div
    class="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center transition hover:shadow-xl"
  >
    <!-- Avatar avec initiales -->
    <div
      class="w-20 h-20 rounded-full flex items-center justify-center bg-blue-500 text-white text-2xl font-bold mb-4"
    >
      {{ initials }}
    </div>

    <!-- Nom et Email -->
    <h2 class="text-xl font-semibold text-gray-800 mb-1">{{ fullName }}</h2>
    <p class="text-sm text-gray-500 mb-2 truncate">{{ user.email }}</p>
    <p class="text-sm text-gray-500 mb-4">📞 {{ user.phone || 'Non renseigné' }}</p>

    <!-- Badge Rôle -->
    <span class="px-3 py-1 rounded-full text-xs font-medium mb-4 bg-blue-500 text-white">
      {{ user.role }}
    </span>

    <hr class="w-full border-gray-200 mb-4" />

    <!-- Infos supplémentaires -->
    <div class="text-sm text-gray-600 space-y-1 w-full text-left">
      <p><span class="font-semibold">Genre :</span> {{ user.gender || 'Non renseigné' }}</p>
      <p>
        <span class="font-semibold">Naissance :</span>
        {{ user.date_of_birth ? formatDate(user.date_of_birth) : 'N/A' }}
        <span v-if="user.place_of_birth"> à {{ user.place_of_birth }}</span>
      </p>
      <p><span class="font-semibold">Nationalité :</span> {{ user.nationality || 'Inconnue' }}</p>
      <p>
        <span class="font-semibold">Statut matrimonial :</span>
        {{ user.status_mat || 'Non précisé' }}
      </p>
    </div>

    <!-- Bouton pour accéder aux demandes -->
    <button
      @click="goToVisaRequests"
      class="mt-6 px-4 py-2 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white rounded-lg shadow-md transition"
    >
      Voir ses demandes
    </button>
  </div>
</template>
