<template>
  <header
    class="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6"
  >
    <button
      type="button"
      class="-ml-1 rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
      aria-label="Buka menu"
      @click="$emit('toggle')"
    >
      <svg
        class="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      >
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <div class="min-w-0 flex-1">
      <h1 class="truncate text-base font-semibold text-slate-900">
        {{ title }}
      </h1>
      <p class="hidden text-xs text-slate-500 sm:block">{{ today }}</p>
    </div>

    <div class="flex items-center gap-3">
      <div class="flex items-center gap-2">
        <span
          class="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-800"
          aria-hidden="true"
          >{{ initial }}</span
        >
        <span class="hidden text-sm font-medium text-slate-700 sm:inline">{{
          username
        }}</span>
      </div>
      <button
        type="button"
        class="btn-secondary !px-3 !py-1.5"
        @click="$emit('logout')"
      >
        Keluar
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { getUsername } from "../services/session";
import { formatLongDate } from "../utils/format";

defineProps({ title: { type: String, default: "" } });
defineEmits(["toggle", "logout"]);

const username = getUsername();
const initial = computed(() => username.charAt(0).toUpperCase());
const today = formatLongDate();
</script>
