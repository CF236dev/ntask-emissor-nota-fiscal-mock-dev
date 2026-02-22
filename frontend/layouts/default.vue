<script setup lang="ts">
import EmissorHeader from "~/components/header/EmissorHeader.vue";
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <EmissorHeader />
    <main class="pt-4">
      <slot />
    </main>
  </div>
</template>
