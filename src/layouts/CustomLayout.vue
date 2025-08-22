<script setup lang="ts">
import NavbarPartial from '@/components/NavbarPartial.vue'
import SidebarComponentVue from '@/components/SidebarComponent.vue.vue'
</script>
<template>
  <NavbarPartial />
  <div class="flex">
    <SidebarComponentVue class="mt-20" />
    <router-view class="ml-50 mt-20" />
  </div>
</template>
