<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const route = useRoute();
const auth = useAuth();

onMounted(() => {
  const returnTo = (route.query.returnTo as string) || "/";
  auth.initiateLogin(returnTo);
});
</script>

<template>
  <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
    <div
      class="animate-spin rounded-full h-12 w-12 border-b-2 border-ntask-blue mx-auto mb-6"
    />
    <h1 class="text-xl font-semibold text-gray-900 mb-2">
      Redirecionando para o login
    </h1>
    <p class="text-gray-600">
      Você será enviado ao portal de autenticação nTask em instantes.
    </p>
  </div>
</template>
