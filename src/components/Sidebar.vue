<template>
  <div
    v-if="open"
    class="fixed inset-0 z-30 bg-slate-900/50 lg:hidden"
    @click="$emit('close')"
  ></div>
  <aside
    class="fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col bg-teal-950 text-teal-50 transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
    aria-label="Menu utama"
  >
    <div class="flex h-16 items-center justify-between px-5">
      <span class="text-lg font-bold tracking-tight">Admin Penjualan</span>
      <button
        type="button"
        class="rounded p-1 text-teal-200 hover:text-white lg:hidden"
        aria-label="Tutup menu"
        @click="$emit('close')"
      >
        <svg
          class="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>

    <nav class="mt-2 flex-1 space-y-1 px-3">
      <RouterLink
        v-for="item in menu"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 rounded-lg border-l-2 border-transparent px-3 py-2.5 text-sm font-medium text-teal-100 transition-colors hover:bg-teal-900 hover:text-white"
        active-class="!border-teal-300 bg-teal-900 !text-white"
      >
        <svg
          class="h-5 w-5 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <template v-if="item.icon === 'grid'">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </template>
          <template v-else-if="item.icon === 'box'">
            <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
            <path d="M4 7.5L12 12l8-4.5M12 12v9" />
          </template>
          <template v-else>
            <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z" />
            <path d="M9 8h6M9 12h6" />
          </template>
        </svg>
        {{ item.label }}
      </RouterLink>
    </nav>

    <p class="px-5 py-4 text-xs text-teal-300/70">
      Master Produk &amp; Transaksi Penjualan
    </p>
  </aside>
</template>

<script setup>
import { watch } from "vue";
import { RouterLink, useRoute } from "vue-router";

const props = defineProps({ open: { type: Boolean, default: false } });
const emit = defineEmits(["close"]);

const menu = [
  { to: "/dashboard", label: "Dashboard", icon: "grid" },
  { to: "/products", label: "Master Produk", icon: "box" },
  { to: "/transactions", label: "Transaksi", icon: "receipt" },
];

// Tutup drawer otomatis setelah pindah halaman (mobile).
const route = useRoute();
watch(
  () => route.path,
  () => props.open && emit("close"),
);
</script>
