<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const auth = useAuth();
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  await auth.initiateLogin();
};
</script>

<template>
  <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-ntask-blue">nTask</h1>
      <p class="text-gray-600 mt-2">Emissor de Nota Fiscal</p>
    </div>

    <div class="space-y-6">
      <p class="text-center text-gray-600">
        Faça login com sua conta nTask para acessar o emissor de nota fiscal.
      </p>

      <button
        type="button"
        :disabled="loading"
        class="btn-primary w-full flex items-center justify-center gap-2"
        @click="handleLogin"
      >
        <div
          v-if="loading"
          class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
        />
        <svg
          v-else
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
          />
        </svg>
        <span>{{ loading ? "Redirecionando..." : "Entrar com nTask" }}</span>
      </button>

      <p class="text-center text-sm text-gray-500">
        Você será redirecionado para o portal de autenticação nTask.
      </p>
    </div>
  </div>
</template>
