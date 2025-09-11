<script setup lang="ts">
import NavbarPartial from '@/components/NavbarPartial.vue'
import SidebarAdmin from '@/components/SidebarAdmin.vue'
</script>
<template>
  <NavbarPartial />
  <div class="flex">
    <SidebarAdmin class="mt-20" />
    <router-view class="md:ml-50 ml-20 mt-20" />
  </div>
</template>
