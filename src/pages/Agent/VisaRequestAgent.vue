<template>
  <div class="p-6">
    <h1 class="text-5xl text-purple-600 font-bold mb-6">👥 Liste des Utilisateurs</h1>

    <div v-if="loading" class="text-center text-gray-500">Chargement...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>

    <!-- Grille responsive -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <UserCard v-for="u in users" :key="u.id" :user="u" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import UserCard from '@/components/UserCard.vue'
import { useUserStore } from '@/stores/userStore'
import type { Custom } from '@/types/user'

const userStore = useUserStore()

const users = ref<Custom[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const res = await userStore.getCustom() // adapte l’URL selon ton backend
    users.value = res?.users ?? []
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
})
</script>
