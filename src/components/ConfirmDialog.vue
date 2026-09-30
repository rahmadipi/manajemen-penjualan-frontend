<template>
  <Teleport to="body">
    <div
      v-if="confirmState.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      @click.self="answerConfirm(false)"
      @keydown.esc="answerConfirm(false)"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        class="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
      >
        <h3 id="confirm-title" class="text-base font-semibold text-slate-900">
          {{ confirmState.title }}
        </h3>
        <p
          id="confirm-message"
          class="mt-2 text-sm leading-relaxed text-slate-600"
        >
          {{ confirmState.message }}
        </p>
        <div class="mt-6 flex justify-end gap-2">
          <button
            ref="cancelBtn"
            type="button"
            class="btn-secondary"
            @click="answerConfirm(false)"
          >
            {{ confirmState.cancelText }}
          </button>
          <button
            type="button"
            :class="confirmState.danger ? 'btn-danger' : 'btn-primary'"
            @click="answerConfirm(true)"
          >
            {{ confirmState.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { nextTick, ref, watch } from "vue";
import { confirmState, answerConfirm } from "../composables/useConfirm";

const cancelBtn = ref(null);

// Fokus awal di tombol Batal supaya aksi berbahaya tidak terpicu tidak sengaja.
watch(
  () => confirmState.open,
  async (open) => {
    if (open) {
      await nextTick();
      cancelBtn.value?.focus();
    }
  },
);
</script>
