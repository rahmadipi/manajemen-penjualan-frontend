<template>
  <div>
    <div class="mb-5">
      <h2 class="text-xl font-bold tracking-tight text-slate-900">
        Transaksi Penjualan
      </h2>
      <p class="text-sm text-slate-500">
        Pilih produk dan jumlah. Total dihitung otomatis, stok ikut berkurang.
      </p>
    </div>

    <!-- Form transaksi -->
    <form class="panel mb-6 p-5" novalidate @submit.prevent="save">
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div class="lg:col-span-2">
          <label for="produk" class="label">Produk</label>
          <select
            id="produk"
            v-model="form.produk_id"
            class="input"
            :class="{ 'input-error': errors.produk_id }"
          >
            <option value="">Pilih produk</option>
            <option
              v-for="p in options"
              :key="p.id"
              :value="p.id"
              :disabled="p.stok < 1"
            >
              {{ p.nama_produk }} ({{
                p.stok < 1 ? "habis" : `stok ${p.stok}`
              }})
            </option>
          </select>
          <p v-if="errors.produk_id" class="field-error">
            {{ errors.produk_id }}
          </p>
          <p v-else-if="selected" class="mt-1 text-xs text-slate-500">
            Harga satuan {{ formatRupiah(selected.harga) }} &middot; stok
            tersedia {{ selected.stok }}
          </p>
        </div>

        <div>
          <label for="qty" class="label">Qty</label>
          <input
            id="qty"
            v-model="form.qty"
            type="number"
            min="1"
            step="1"
            class="input"
            :class="{ 'input-error': qtyError || errors.qty }"
          />
          <p v-if="qtyError || errors.qty" class="field-error">
            {{ qtyError || errors.qty }}
          </p>
        </div>

        <div>
          <label for="tanggal" class="label">Tanggal &amp; waktu</label>
          <input
            id="tanggal"
            v-model="form.tanggal"
            type="datetime-local"
            :max="maxDate"
            class="input"
            :class="{ 'input-error': errors.tanggal_transaksi }"
          />
          <p v-if="errors.tanggal_transaksi" class="field-error">
            {{ errors.tanggal_transaksi }}
          </p>
        </div>
      </div>

      <div
        class="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <p class="text-sm text-slate-500">Total harga</p>
          <p class="text-2xl font-bold tabular-nums text-slate-900">
            {{ formatRupiah(total) }}
          </p>
        </div>
        <button
          class="btn-primary sm:min-w-44"
          :disabled="saving || !canSubmit"
        >
          {{ saving ? "Menyimpan..." : "Simpan transaksi" }}
        </button>
      </div>
    </form>

    <!-- Riwayat -->
    <section class="panel overflow-hidden">
      <div class="border-b border-slate-200 p-4">
        <h3 class="font-semibold text-slate-900">Riwayat transaksi</h3>
        <div
          class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_1fr_1fr_auto] lg:items-end"
        >
          <div>
            <label for="cari" class="label">Cari produk</label>
            <input
              id="cari"
              v-model="filters.search"
              type="search"
              class="input"
              placeholder="Cari nama produk..."
            />
          </div>
          <div>
            <label for="dari" class="label">Dari tanggal</label>
            <input
              id="dari"
              v-model="filters.start_date"
              type="date"
              class="input"
            />
          </div>
          <div>
            <label for="sampai" class="label">Sampai tanggal</label>
            <input
              id="sampai"
              v-model="filters.end_date"
              type="date"
              class="input"
            />
          </div>
          <button
            v-if="hasFilters"
            type="button"
            class="btn-secondary"
            @click="resetFilters"
          >
            Reset filter
          </button>
        </div>
        <p v-if="dateRangeInvalid" class="field-error">
          Tanggal awal tidak boleh setelah tanggal akhir.
        </p>
      </div>

      <div
        class="overflow-x-auto"
        :class="{ 'opacity-60': loading && rows.length }"
      >
        <table class="w-full">
          <thead class="border-b border-slate-200 bg-slate-50">
            <tr>
              <th class="th w-16">No</th>
              <th class="th">Tanggal</th>
              <th class="th">Produk</th>
              <th class="th text-right">Harga satuan</th>
              <th class="th text-right">Qty</th>
              <th class="th text-right">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="(t, i) in rows" :key="t.id">
              <td class="td tabular-nums text-slate-400">
                {{ (pagination.page - 1) * pagination.limit + i + 1 }}
              </td>
              <td class="td whitespace-nowrap">
                {{ formatDateTime(t.tanggal_transaksi) }}
              </td>
              <td class="td font-medium text-slate-900">
                {{ t.produk?.nama_produk || "(produk dihapus)" }}
              </td>
              <td class="td text-right tabular-nums">
                {{ formatRupiah(t.harga_satuan) }}
              </td>
              <td class="td text-right tabular-nums">{{ t.qty }}</td>
              <td class="td text-right font-medium tabular-nums text-slate-900">
                {{ formatRupiah(t.total_harga) }}
              </td>
            </tr>
            <tr v-if="loading && !rows.length">
              <td
                colspan="6"
                class="px-4 py-12 text-center text-sm text-slate-500"
              >
                Memuat data...
              </td>
            </tr>
            <tr v-else-if="loadError">
              <td colspan="6" class="px-4 py-12 text-center">
                <p class="text-sm text-red-600">{{ loadError }}</p>
                <button
                  type="button"
                  class="btn-secondary mt-3"
                  @click="loadHistory"
                >
                  Coba lagi
                </button>
              </td>
            </tr>
            <tr v-else-if="!rows.length">
              <td
                colspan="6"
                class="px-4 py-12 text-center text-sm text-slate-500"
              >
                {{
                  hasFilters
                    ? "Tidak ada transaksi yang cocok dengan filter."
                    : "Belum ada transaksi."
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Pagination
        :page="pagination.page"
        :total-pages="pagination.totalPages"
        :total="pagination.total"
        :limit="pagination.limit"
        @change="goTo"
      />
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import Pagination from "../components/Pagination.vue";
import { getProductOptions } from "../services/products";
import { getTransactions, createTransaction } from "../services/transactions";
import { getErrorMessage, getFieldErrors } from "../services/api";
import { useToast } from "../composables/useToast";
import {
  debounce,
  formatDateTime,
  formatRupiah,
  toLocalInput,
} from "../utils/format";

const toast = useToast();

// ----- form transaksi -----
const options = ref([]);
const form = reactive({ produk_id: "", qty: 1, tanggal: toLocalInput() });
const errors = reactive({});
const saving = ref(false);
const maxDate = ref(toLocalInput());

const selected = computed(() =>
  options.value.find((p) => p.id === Number(form.produk_id)),
);
const qtyNumber = computed(() => Number(form.qty));
const total = computed(() =>
  selected.value && qtyNumber.value > 0
    ? Number(selected.value.harga) * qtyNumber.value
    : 0,
);

const qtyError = computed(() => {
  if (
    form.qty === "" ||
    !Number.isInteger(qtyNumber.value) ||
    qtyNumber.value < 1
  )
    return "Qty minimal 1 (bilangan bulat)";
  if (selected.value && qtyNumber.value > selected.value.stok)
    return `Stok tersedia hanya ${selected.value.stok}`;
  return "";
});
const canSubmit = computed(() => Boolean(selected.value) && !qtyError.value);

// Hapus pesan error server begitu input diubah.
watch(
  () => [form.produk_id, form.qty, form.tanggal],
  () => Object.keys(errors).forEach((k) => delete errors[k]),
);

async function loadOptions() {
  try {
    options.value = await getProductOptions();
  } catch (e) {
    toast.error(getErrorMessage(e, "Gagal memuat daftar produk"));
  }
}

async function save() {
  if (!canSubmit.value) return;
  saving.value = true;
  try {
    const trx = await createTransaction({
      produk_id: Number(form.produk_id),
      qty: qtyNumber.value,
      tanggal_transaksi: form.tanggal
        ? new Date(form.tanggal).toISOString()
        : undefined,
    });
    toast.success(
      `Transaksi ${trx.produk?.nama_produk || ""} (${trx.qty}x) berhasil disimpan.`,
    );
    Object.assign(form, { produk_id: "", qty: 1, tanggal: toLocalInput() });
    maxDate.value = toLocalInput();
    pagination.page = 1;
    await Promise.all([loadOptions(), loadHistory()]); // stok produk sudah berubah
  } catch (e) {
    const fieldErrors = getFieldErrors(e);
    if (Object.keys(fieldErrors).length) Object.assign(errors, fieldErrors);
    toast.error(getErrorMessage(e, "Gagal menyimpan transaksi"));
    if (e.response?.status === 400 || e.response?.status === 404)
      await loadOptions(); // sinkronkan stok terbaru
  } finally {
    saving.value = false;
  }
}

// ----- riwayat, filter, pagination -----
const rows = ref([]);
const pagination = reactive({ page: 1, limit: 10, total: 0, totalPages: 1 });
const filters = reactive({ search: "", start_date: "", end_date: "" });
const loading = ref(false);
const loadError = ref("");
let requestId = 0;

const hasFilters = computed(() =>
  Boolean(filters.search.trim() || filters.start_date || filters.end_date),
);
const dateRangeInvalid = computed(
  () =>
    Boolean(filters.start_date && filters.end_date) &&
    filters.start_date > filters.end_date,
);

async function loadHistory() {
  if (dateRangeInvalid.value) return;
  const id = ++requestId;
  loading.value = true;
  loadError.value = "";
  try {
    const res = await getTransactions({
      page: pagination.page,
      limit: pagination.limit,
      search: filters.search.trim(),
      start_date: filters.start_date,
      end_date: filters.end_date,
    });
    if (id !== requestId) return;
    rows.value = res.data;
    Object.assign(pagination, res.pagination);
  } catch (e) {
    if (id !== requestId) return;
    rows.value = [];
    loadError.value = getErrorMessage(e, "Gagal memuat riwayat transaksi");
  } finally {
    if (id === requestId) loading.value = false;
  }
}

const filterNow = debounce(() => {
  pagination.page = 1;
  loadHistory();
}, 350);
watch(filters, filterNow);

const resetFilters = () =>
  Object.assign(filters, { search: "", start_date: "", end_date: "" });

function goTo(page) {
  pagination.page = page;
  loadHistory();
}

onMounted(() => {
  loadOptions();
  loadHistory();
});
</script>
