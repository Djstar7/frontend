<script setup lang="ts">
import NavbarPartial from '@/components/NavbarPartial.vue'
import SidebarCustom from '@/components/SidebarCustom.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navbar en haut -->
    <NavbarPartial />

    <!-- Contenu principal -->
    <div class="flex flex-1">
      <!-- Sidebar fixe -->
      <SidebarCustom class="mt-20" />

      <!-- Zone de rendu des pages -->
      <div class="flex-1 md:ml-50 ml-20 mt-20 min-w-[88.5vw]">
        <router-view />
      </div>
    </div>
  </div>
</template>
