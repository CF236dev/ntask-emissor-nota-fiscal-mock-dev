<script setup lang="ts">
import type { Module } from "~/utils/modules";

interface Props {
  modules: Module[];
}

interface Emits {
  (e: "open-module", mod: Module): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <div
    class="fixed top-14 right-24 bg-white rounded-xl shadow-2xl p-4 z-[1050]"
  >
    <div class="grid grid-cols-3 gap-4">
      <div
        v-for="mod in modules"
        :key="mod.id"
        class="flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-100"
        @click="emit('open-module', mod)"
      >
        <div
          class="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
          :style="{ background: mod.color }"
        >
          <span>{{ mod.icon }}</span>
        </div>
        <span class="text-xs font-medium text-gray-800 text-center">
          {{ mod.label }}
        </span>
      </div>
    </div>
  </div>
</template>
