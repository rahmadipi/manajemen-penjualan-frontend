<template>
  <div>
    <div v-if="loading" class="space-y-4" aria-busy="true">
      <div class="h-24 animate-pulse rounded-xl bg-slate-200"></div>
      <div class="h-64 animate-pulse rounded-xl bg-slate-200"></div>
    </div>

    <div v-else-if="error" class="panel p-8 text-center">
      <p class="text-sm text-red-600">{{ error }}</p>
      <button class="btn-secondary mt-4" @click="load">Coba lagi</button>
    </div>

    <div v-else class="space-y-6">
      <!-- Ringkasan -->
      <div
        class="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 lg:grid-cols-4"
      >
        <div class="bg-white p-5">
          <p class="text-sm text-slate-500">Total produk</p>
          <p class="mt-1 text-2xl font-bold tabular-nums text-slate-900">
            {{ formatNumber(data.totalProduk) }}
          </p>
        </div>
        <div class="bg-white p-5">
          <p class="text-sm text-slate-500">Total transaksi</p>
          <p class="mt-1 text-2xl font-bold tabular-nums text-slate-900">
            {{ formatNumber(data.totalTransaksi) }}
          </p>
        </div>
        <div class="bg-white p-5">
          <p class="text-sm text-slate-500">Total pendapatan</p>
          <p class="mt-1 text-2xl font-bold tabular-nums text-slate-900">
            {{ formatRupiah(data.totalPendapatan) }}
          </p>
        </div>
        <div class="bg-white p-5">
          <p class="text-sm text-slate-500">Stok menipis</p>
          <p
            class="mt-1 text-2xl font-bold tabular-nums"
            :class="
              data.jumlahStokMenipis ? 'text-amber-600' : 'text-slate-900'
            "
          >
            {{ formatNumber(data.jumlahStokMenipis) }}
          </p>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <!-- Grafik 7 hari -->
        <section class="panel p-5 lg:col-span-2">
          <h2 class="font-semibold text-slate-900">
            Penjualan 7 hari terakhir
          </h2>
          <p class="text-sm text-slate-500">
            {{ formatRupiah(weekTotal) }} dari
            {{ formatNumber(weekCount) }} transaksi
          </p>
          <div class="mt-6 flex gap-2 sm:gap-3">
            <div
              v-for="d in data.penjualanHarian"
              :key="d.tanggal"
              class="flex min-w-0 flex-1 flex-col items-center"
            >
              <div class="flex h-44 w-full items-end justify-center">
                <div
                  class="w-full max-w-10 rounded-t-md"
                  :class="d.total > 0 ? 'bg-teal-600' : 'bg-slate-200'"
                  :style="{ height: barHeight(d.total) }"
                  role="img"
                  :aria-label="`${formatShortDay(d.tanggal)}: ${formatRupiah(d.total)}`"
                  :title="`${formatShortDay(d.tanggal)}: ${formatRupiah(d.total)} (${d.transaksi} transaksi)`"
                ></div>
              </div>
              <span class="mt-2 text-xs text-slate-500">{{
                formatShortDay(d.tanggal)
              }}</span>
            </div>
          </div>
        </section>

        <!-- Stok menipis -->
        <section class="panel p-5">
          <h2 class="font-semibold text-slate-900">Perlu diisi ulang</h2>
          <p class="text-sm text-slate-500">
            Stok {{ data.batasStokMenipis }} atau kurang
          </p>
          <ul
            v-if="data.stokMenipis.length"
            class="mt-4 divide-y divide-slate-100"
          >
            <li
              v-for="p in data.stokMenipis"
              :key="p.id"
              class="flex items-center justify-between gap-3 py-2.5"
            >
              <span class="truncate text-sm text-slate-700">{{
                p.nama_produk
              }}</span>
              <span
                class="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold"
                :class="
                  p.stok === 0
                    ? 'bg-red-100 text-red-700'
                    : 'bg-amber-100 text-amber-800'
                "
              >
                {{ p.stok === 0 ? "Habis" : `Sisa ${p.stok}` }}
              </span>
            </li>
          </ul>
          <p v-else class="mt-4 text-sm text-slate-500">
            Semua produk masih punya stok cukup.
          </p>
          <RouterLink
            v-if="data.stokMenipis.length"
            to="/products"
            class="mt-3 inline-block text-sm font-medium text-teal-700 hover:text-teal-900"
          >
            Kelola produk
          </RouterLink>
        </section>
      </div>

      <!-- Transaksi terbaru -->
      <section class="panel overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4">
          <h2 class="font-semibold text-slate-900">Transaksi terbaru</h2>
          <RouterLink
            to="/transactions"
            class="text-sm font-medium text-teal-700 hover:text-teal-900"
            >Lihat semua</RouterLink
          >
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="border-y border-slate-200 bg-slate-50">
              <tr>
                <th class="th">Tanggal</th>
                <th class="th">Produk</th>
                <th class="th text-right">Qty</th>
                <th class="th text-right">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="t in data.transaksiTerbaru" :key="t.id">
                <td class="td whitespace-nowrap">
                  {{ formatDateTime(t.tanggal_transaksi) }}
                </td>
                <td class="td">{{ t.produk?.nama_produk || "-" }}</td>
                <td class="td text-right tabular-nums">{{ t.qty }}</td>
                <td
                  class="td text-right font-medium tabular-nums text-slate-900"
                >
                  {{ formatRupiah(t.total_harga) }}
                </td>
              </tr>
              <tr v-if="!data.transaksiTerbaru.length">
                <td
                  colspan="4"
                  class="px-4 py-10 text-center text-sm text-slate-500"
                >
                  Belum ada transaksi. Catat penjualan pertama di menu
                  Transaksi.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { getDashboard } from "../services/dashboard";
import { getErrorMessage } from "../services/api";
import {
  formatDateTime,
  formatNumber,
  formatRupiah,
  formatShortDay,
} from "../utils/format";

const data = ref(null);
const loading = ref(true);
const error = ref("");

async function load() {
  loading.value = true;
  error.value = "";
  try {
    data.value = await getDashboard();
  } catch (e) {
    error.value = getErrorMessage(e, "Gagal memuat dashboard");
  } finally {
    loading.value = false;
  }
}

const maxTotal = computed(() =>
  Math.max(...(data.value?.penjualanHarian.map((d) => d.total) || [0]), 1),
);
const weekTotal = computed(() =>
  data.value.penjualanHarian.reduce((s, d) => s + d.total, 0),
);
const weekCount = computed(() =>
  data.value.penjualanHarian.reduce((s, d) => s + d.transaksi, 0),
);
// Hari tanpa penjualan tetap diberi garis tipis agar sumbu terbaca.
const barHeight = (total) =>
  total > 0 ? `${Math.max((total / maxTotal.value) * 100, 4)}%` : "2px";

onMounted(load);
</script>
