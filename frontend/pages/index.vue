<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  ssr: false,
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-gray-900">Emissor de Nota Fiscal</h1>
    <p class="mt-2 text-gray-600">
      Módulo mock para demonstração. Integrado ao SSO nTask IdP.
    </p>
  </div>
</template>
