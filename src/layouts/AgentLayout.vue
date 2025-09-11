<script setup lang="ts">
import NavbarPartial from '@/components/NavbarPartial.vue'
import SidebarAgent from '@/components/SidebarAgent.vue'
</script>
<template>
  <NavbarPartial />
  <div class="flex">
    <SidebarAgent class="mt-20" />
    <router-view class="md:ml-50 flex-1 ml-20 mt-20 min-w-[88.5vw]" />
  </div>
</template>
