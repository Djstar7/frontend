<script setup lang="ts">
import AuthLayout from './layouts/AuthLayout.vue'
import AgentLayout from './layouts/AgentLayout.vue'
import AdminLayout from './layouts/AdminLayout.vue'
import MainLayout from './layouts/MainLayout.vue'

import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
// Computed pour obtenir le chemin actuel du routeur
// Cela permet de déterminer quel layout afficher en fonction du chemin
const routerPath = computed(() => router.currentRoute.value.path)
</script>

<template>
  <div>
    <AuthLayout v-if="routerPath.includes('/auth')" />
    <AgentLayout v-else-if="routerPath.includes('/agent')" />
    <AdminLayout v-else-if="routerPath.includes('/admin')" />
    <MainLayout v-else />
  </div>
</template>
