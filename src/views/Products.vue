<template>
  <div>
    <div
      class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <h2 class="text-xl font-bold tracking-tight text-slate-900">
          Master Produk
        </h2>
        <p class="text-sm text-slate-500">
          Kelola daftar produk, harga, dan stok.
        </p>
      </div>
      <button type="button" class="btn-primary" @click="openAdd">
        Tambah produk
      </button>
    </div>

    <div class="panel overflow-hidden">
      <div
        class="flex flex-col gap-2 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="w-full sm:max-w-xs">
          <label for="search" class="label">Cari produk</label>
          <input
            id="search"
            v-model="search"
            type="search"
            class="input"
            placeholder="Cari nama produk..."
          />
        </div>
        <p v-if="search.trim() && !loading" class="text-sm text-slate-500">
          {{ pagination.total }} produk cocok dengan "{{ search.trim() }}"
        </p>
      </div>

      <div
        class="overflow-x-auto"
        :class="{ 'opacity-60': loading && items.length }"
      >
        <table class="w-full">
          <thead class="border-b border-slate-200 bg-slate-50">
            <tr>
              <th class="th w-16">No</th>
              <th class="th">Nama produk</th>
              <th class="th text-right">Harga</th>
              <th class="th text-right">Stok</th>
              <th class="th text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="(p, i) in items" :key="p.id">
              <td class="td tabular-nums text-slate-400">
                {{ (pagination.page - 1) * pagination.limit + i + 1 }}
              </td>
              <td class="td font-medium text-slate-900">{{ p.nama_produk }}</td>
              <td class="td text-right tabular-nums">
                {{ formatRupiah(p.harga) }}
              </td>
              <td class="td text-right">
                <span class="tabular-nums">{{ p.stok }}</span>
                <span
                  v-if="p.stok <= 5"
                  class="ml-2 rounded-full px-2 py-0.5 text-xs font-semibold"
                  :class="
                    p.stok === 0
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-800'
                  "
                  >{{ p.stok === 0 ? "Habis" : "Menipis" }}</span
                >
              </td>
              <td class="td whitespace-nowrap text-right">
                <button
                  type="button"
                  class="link-action text-teal-700 hover:bg-teal-50"
                  @click="openEdit(p)"
                >
                  Edit
                </button>
                <button
                  type="button"
                  class="link-action text-red-600 hover:bg-red-50"
                  @click="remove(p)"
                >
                  Hapus
                </button>
              </td>
            </tr>
            <tr v-if="loading && !items.length">
              <td
                colspan="5"
                class="px-4 py-12 text-center text-sm text-slate-500"
              >
                Memuat data...
              </td>
            </tr>
            <tr v-else-if="loadError">
              <td colspan="5" class="px-4 py-12 text-center">
                <p class="text-sm text-red-600">{{ loadError }}</p>
                <button type="button" class="btn-secondary mt-3" @click="load">
                  Coba lagi
                </button>
              </td>
            </tr>
            <tr v-else-if="!items.length">
              <td
                colspan="5"
                class="px-4 py-12 text-center text-sm text-slate-500"
              >
                <template v-if="search.trim()"
                  >Tidak ada produk yang cocok dengan pencarian.</template
                >
                <template v-else>
                  Belum ada produk.
                  <button
                    type="button"
                    class="font-medium text-teal-700 hover:text-teal-900"
                    @click="openAdd"
                  >
                    Tambah produk pertama
                  </button>
                </template>
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
    </div>

    <!-- Form tambah / edit -->
    <div
      v-if="showForm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      @click.self="closeForm"
      @keydown.esc="closeForm"
    >
      <form
        class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
        novalidate
        @submit.prevent="save"
      >
        <h3 id="form-title" class="text-lg font-semibold text-slate-900">
          {{ editingId ? "Edit produk" : "Tambah produk" }}
        </h3>

        <div class="mt-5">
          <label for="nama_produk" class="label">Nama produk</label>
          <input
            id="nama_produk"
            ref="nameInput"
            v-model="form.nama_produk"
            class="input"
            :class="{ 'input-error': errors.nama_produk }"
            maxlength="150"
          />
          <p v-if="errors.nama_produk" class="field-error">
            {{ errors.nama_produk }}
          </p>
        </div>

        <div class="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label for="harga" class="label">Harga (Rp)</label>
            <input
              id="harga"
              v-model="form.harga"
              type="number"
              min="0"
              class="input"
              :class="{ 'input-error': errors.harga }"
            />
            <p v-if="errors.harga" class="field-error">{{ errors.harga }}</p>
          </div>
          <div>
            <label for="stok" class="label">Stok</label>
            <input
              id="stok"
              v-model="form.stok"
              type="number"
              min="0"
              step="1"
              class="input"
              :class="{ 'input-error': errors.stok }"
            />
            <p v-if="errors.stok" class="field-error">{{ errors.stok }}</p>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-2">
          <button
            type="button"
            class="btn-secondary"
            :disabled="saving"
            @click="closeForm"
          >
            Batal
          </button>
          <button class="btn-primary" :disabled="saving">
            {{ saving ? "Menyimpan..." : "Simpan" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, reactive, ref, watch } from "vue";
import Pagination from "../components/Pagination.vue";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/products";
import { getErrorMessage, getFieldErrors } from "../services/api";
import { useToast } from "../composables/useToast";
import { useConfirm } from "../composables/useConfirm";
import { debounce, formatRupiah } from "../utils/format";

const toast = useToast();
const { confirm } = useConfirm();

// ----- daftar, pencarian, pagination -----
const items = ref([]);
const pagination = reactive({ page: 1, limit: 10, total: 0, totalPages: 1 });
const search = ref("");
const loading = ref(false);
const loadError = ref("");
let requestId = 0; // abaikan respons lama bila ada request yang lebih baru

async function load() {
  const id = ++requestId;
  loading.value = true;
  loadError.value = "";
  try {
    const res = await getProducts({
      page: pagination.page,
      limit: pagination.limit,
      search: search.value.trim(),
    });
    if (id !== requestId) return;
    items.value = res.data;
    Object.assign(pagination, res.pagination);
  } catch (e) {
    if (id !== requestId) return;
    items.value = [];
    loadError.value = getErrorMessage(e, "Gagal memuat produk");
  } finally {
    if (id === requestId) loading.value = false;
  }
}

const searchNow = debounce(() => {
  pagination.page = 1;
  load();
}, 350);
watch(search, searchNow);

function goTo(page) {
  pagination.page = page;
  load();
}

// ----- form tambah / edit -----
const showForm = ref(false);
const editingId = ref(null);
const saving = ref(false);
const nameInput = ref(null);
const form = reactive({ nama_produk: "", harga: "", stok: "" });
const errors = reactive({});

const clearErrors = () => Object.keys(errors).forEach((k) => delete errors[k]);

async function openForm(product) {
  clearErrors();
  editingId.value = product?.id ?? null;
  Object.assign(form, {
    nama_produk: product?.nama_produk ?? "",
    harga: product ? Number(product.harga) : "",
    stok: product ? product.stok : "",
  });
  showForm.value = true;
  await nextTick();
  nameInput.value?.focus();
}
const openAdd = () => openForm(null);
const openEdit = (product) => openForm(product);
const closeForm = () => !saving.value && (showForm.value = false);

function validate() {
  clearErrors();
  if (!form.nama_produk.trim()) errors.nama_produk = "Nama produk wajib diisi";
  const harga = Number(form.harga);
  if (form.harga === "" || Number.isNaN(harga))
    errors.harga = "Harga wajib diisi dengan angka";
  else if (harga < 0) errors.harga = "Harga tidak boleh negatif";
  const stok = Number(form.stok);
  if (form.stok === "" || !Number.isInteger(stok))
    errors.stok = "Stok harus bilangan bulat";
  else if (stok < 0) errors.stok = "Stok tidak boleh negatif";
  return Object.keys(errors).length === 0;
}

async function save() {
  if (!validate()) return;
  saving.value = true;
  const payload = {
    nama_produk: form.nama_produk.trim(),
    harga: Number(form.harga),
    stok: Number(form.stok),
  };
  try {
    if (editingId.value) await updateProduct(editingId.value, payload);
    else await createProduct(payload);
    toast.success(
      editingId.value
        ? "Perubahan produk disimpan."
        : "Produk berhasil ditambahkan.",
    );
    showForm.value = false;
    if (!editingId.value) pagination.page = 1; // produk baru tampil di halaman pertama
    await load();
  } catch (e) {
    const fieldErrors = getFieldErrors(e);
    if (Object.keys(fieldErrors).length) Object.assign(errors, fieldErrors);
    else toast.error(getErrorMessage(e, "Gagal menyimpan produk"));
  } finally {
    saving.value = false;
  }
}

// ----- hapus -----
async function remove(product) {
  const ok = await confirm({
    title: "Hapus produk?",
    message: `"${product.nama_produk}" akan dihapus permanen dan tidak bisa dikembalikan.`,
    confirmText: "Hapus",
    danger: true,
  });
  if (!ok) return;
  try {
    await deleteProduct(product.id);
    toast.success("Produk berhasil dihapus.");
    if (items.value.length === 1 && pagination.page > 1) pagination.page -= 1;
    await load();
  } catch (e) {
    toast.error(getErrorMessage(e, "Gagal menghapus produk"));
  }
}

onMounted(load);
</script>
