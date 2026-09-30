<template>
  <div
    v-if="total > 0"
    class="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row"
  >
    <p class="text-sm text-slate-500">
      Menampilkan {{ from }}&ndash;{{ to }} dari {{ total }} data
    </p>
    <nav class="flex items-center gap-1" aria-label="Pagination">
      <button
        type="button"
        class="btn-secondary !px-3 !py-1.5"
        :disabled="page <= 1"
        @click="$emit('change', page - 1)"
      >
        Sebelumnya
      </button>
      <div class="hidden items-center gap-1 sm:flex">
        <button
          v-for="p in pages"
          :key="p"
          type="button"
          class="h-8 min-w-8 rounded-lg px-2 text-sm font-medium transition-colors"
          :class="
            p === page
              ? 'bg-teal-700 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          "
          :aria-current="p === page ? 'page' : undefined"
          @click="$emit('change', p)"
        >
          {{ p }}
        </button>
      </div>
      <span class="px-2 text-sm text-slate-500 sm:hidden"
        >{{ page }} / {{ totalPages }}</span
      >
      <button
        type="button"
        class="btn-secondary !px-3 !py-1.5"
        :disabled="page >= totalPages"
        @click="$emit('change', page + 1)"
      >
        Berikutnya
      </button>
    </nav>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  total: { type: Number, required: true },
  limit: { type: Number, required: true },
});
defineEmits(["change"]);

const from = computed(() => (props.page - 1) * props.limit + 1);
const to = computed(() => Math.min(props.page * props.limit, props.total));
// Tampilkan maksimal 5 nomor halaman di sekitar halaman aktif.
const pages = computed(() => {
  const start = Math.max(1, Math.min(props.page - 2, props.totalPages - 4));
  const end = Math.min(props.totalPages, start + 4);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});
</script>
