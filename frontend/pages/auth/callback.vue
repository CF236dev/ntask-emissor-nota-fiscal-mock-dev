<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const route = useRoute();
const router = useRouter();
const auth = useAuth();
const authStore = useAuthStore();

const error = ref<string | null>(null);
const loading = ref(true);

onMounted(async () => {
  const code = route.query.code as string;
  const state = route.query.state as string;
  const errorParam = route.query.error as string;

  if (errorParam) {
    error.value =
      (route.query.error_description as string) || "Erro na autenticação";
    loading.value = false;
    return;
  }

  if (!code || !state) {
    error.value = "Parâmetros de autenticação inválidos";
    loading.value = false;
    return;
  }

  try {
    const tokenResponse = await auth.handleCallback(code, state);
    const user = await auth.fetchUserInfo(tokenResponse.access_token);
    authStore.setAuth(user, tokenResponse.access_token);

    const returnTo = auth.getReturnToFromState(state);
    await router.push(returnTo);
  } catch (e: unknown) {
    error.value =
      (e as Error)?.message || "Erro ao processar autenticação";
    loading.value = false;
  }
});

function retryLogin() {
  auth.initiateLogin();
}
</script>

<template>
  <div
    class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center"
  >
    <div v-if="loading" class="space-y-4">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-ntask-blue mx-auto"
      />
      <p class="text-gray-600">Autenticando...</p>
    </div>

    <div v-else-if="error" class="space-y-4">
      <div
        class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto"
      >
        <svg
          class="w-8 h-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <h2 class="text-xl font-bold text-gray-900">Erro na Autenticação</h2>
      <p class="text-gray-600">{{ error }}</p>
      <button type="button" class="btn-primary w-full" @click="retryLogin">
        Tentar Novamente
      </button>
    </div>
  </div>
</template>
