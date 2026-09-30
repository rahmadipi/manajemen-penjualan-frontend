<template>
  <div
    class="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6"
    aria-live="polite"
  >
    <TransitionGroup name="toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border bg-white px-4 py-3 text-sm shadow-lg"
        :class="border[t.type]"
        :role="t.type === 'error' ? 'alert' : 'status'"
      >
        <span
          class="mt-1.5 h-2 w-2 shrink-0 rounded-full"
          :class="dot[t.type]"
        ></span>
        <p class="flex-1 text-slate-700">{{ t.message }}</p>
        <button
          type="button"
          class="-mr-1 rounded px-1 text-slate-400 hover:text-slate-700"
          aria-label="Tutup notifikasi"
          @click="remove(t.id)"
        >
          &times;
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from "../composables/useToast";

const { toasts, remove } = useToast();
const border = {
  success: "border-teal-200",
  error: "border-red-200",
  info: "border-slate-200",
};
const dot = {
  success: "bg-teal-600",
  error: "bg-red-600",
  info: "bg-slate-500",
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
