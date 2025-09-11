<script setup lang="ts">
import NavbarPartial from '@/components/NavbarPartial.vue'
import SidebarCustom from '@/components/SidebarCustom.vue'
</script>
<template>
  <NavbarPartial />
  <div class="flex">
    <SidebarCustom class="mt-20" />
    <router-view class="md:ml-50 flex-1 ml-20 mt-20 min-w-[88.5vw]" />
  </div>
</template>
