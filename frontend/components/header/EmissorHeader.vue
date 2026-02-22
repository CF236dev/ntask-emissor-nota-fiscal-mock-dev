<script setup lang="ts">
import { getModules } from "~/utils/modules";
import type { Module } from "~/utils/modules";
import ModulesPopup from "~/components/pop-ups/ModulesPopup.vue";

const config = useRuntimeConfig();
const authStore = useAuthStore();
const auth = useAuth();

const showModulesPopup = ref(false);
const user = computed(() => authStore.user);

const modules = computed(() =>
  getModules({
    idpFrontendUrl: config.public.idpFrontendUrl,
    processosUrl: config.public.processosUrl,
  })
);

function openModule(mod: Module) {
  showModulesPopup.value = false;
  if (mod.internalPath) {
    navigateTo(mod.internalPath);
  } else if (mod.externalUrl) {
    window.open(mod.externalUrl, "_blank");
  }
}

function handleLogout() {
  auth.logout();
}
</script>

<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div
      class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between"
    >
      <a
        :href="config.public.idpFrontendUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="text-2xl font-bold text-ntask-blue"
      >
        nTask IdP
      </a>

      <div class="flex items-center gap-4">
        <div class="relative">
          <button
            type="button"
            class="flex items-center justify-center w-10 h-10 p-0 border-0 bg-transparent rounded-full cursor-pointer transition-colors hover:bg-gray-200 text-gray-600"
            title="Módulos"
            @click="showModulesPopup = !showModulesPopup"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="5" r="2.5" />
              <circle cx="12" cy="5" r="2.5" />
              <circle cx="19" cy="5" r="2.5" />
              <circle cx="5" cy="12" r="2.5" />
              <circle cx="12" cy="12" r="2.5" />
              <circle cx="19" cy="12" r="2.5" />
              <circle cx="5" cy="19" r="2.5" />
              <circle cx="12" cy="19" r="2.5" />
              <circle cx="19" cy="19" r="2.5" />
            </svg>
          </button>

          <Teleport to="body">
            <div
              v-if="showModulesPopup"
              class="fixed inset-0 z-[1040]"
              @click="showModulesPopup = false"
            />
            <ModulesPopup
              v-if="showModulesPopup"
              :modules="modules"
              @open-module="openModule"
            />
          </Teleport>
        </div>

        <span class="text-gray-700">{{ user?.name }}</span>

        <button
          type="button"
          class="text-sm text-gray-500 hover:text-gray-700"
          @click="handleLogout"
        >
          Sair
        </button>
      </div>
    </div>
  </header>
</template>
