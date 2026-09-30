<template>
  <div class="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,4fr)]">
    <section
      class="hidden flex-col justify-between bg-teal-950 p-12 text-teal-50 lg:flex"
    >
      <span class="text-lg font-bold tracking-tight">Admin Penjualan</span>
      <div class="max-w-md">
        <h2 class="text-4xl font-bold leading-tight tracking-tight">
          Catat penjualan, jaga stok tetap akurat.
        </h2>
        <ul class="mt-8 space-y-4 text-sm leading-relaxed text-teal-100">
          <li class="flex gap-3">
            <span
              class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-300"
            ></span>
            Stok produk berkurang otomatis setiap ada transaksi.
          </li>
          <li class="flex gap-3">
            <span
              class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-300"
            ></span>
            Total dihitung dari harga dikali jumlah, tanpa hitung manual.
          </li>
          <li class="flex gap-3">
            <span
              class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-300"
            ></span>
            Harga saat transaksi tersimpan, jadi riwayat tidak berubah saat
            harga produk diubah.
          </li>
        </ul>
      </div>
      <p class="text-xs text-teal-300/70">
        Master Produk &amp; Transaksi Penjualan
      </p>
    </section>

    <section class="flex items-center justify-center p-6 sm:p-12">
      <form class="w-full max-w-sm" novalidate @submit.prevent="submit">
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">
          Masuk ke akun Anda
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          Gunakan akun admin untuk mengelola produk dan transaksi.
        </p>

        <p
          v-if="$route.query.expired"
          class="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800"
          role="status"
        >
          Sesi Anda telah berakhir. Silakan masuk kembali.
        </p>
        <p
          v-if="error"
          class="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {{ error }}
        </p>

        <div class="mt-6">
          <label for="username" class="label">Username</label>
          <input
            id="username"
            v-model="form.username"
            class="input"
            :class="{ 'input-error': errors.username }"
            autocomplete="username"
            autofocus
          />
          <p v-if="errors.username" class="field-error">
            {{ errors.username }}
          </p>
        </div>

        <div class="mt-4">
          <label for="password" class="label">Password</label>
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="input pr-20"
              :class="{ 'input-error': errors.password }"
              autocomplete="current-password"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 px-3 text-sm font-medium text-teal-700 hover:text-teal-900"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? "Sembunyikan" : "Tampilkan" }}
            </button>
          </div>
          <p v-if="errors.password" class="field-error">
            {{ errors.password }}
          </p>
        </div>

        <button class="btn-primary mt-6 w-full !py-2.5" :disabled="loading">
          {{ loading ? "Memproses..." : "Masuk" }}
        </button>
        <p class="mt-4 text-center text-xs text-slate-400">
          Akun demo: admin / admin123
        </p>
      </form>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { login } from "../services/auth";
import { getErrorMessage } from "../services/api";

const route = useRoute();
const router = useRouter();
const form = reactive({ username: "", password: "" });
const errors = reactive({ username: "", password: "" });
const error = ref("");
const loading = ref(false);
const showPassword = ref(false);

async function submit() {
  error.value = "";
  errors.username = form.username.trim() ? "" : "Username wajib diisi";
  errors.password = form.password ? "" : "Password wajib diisi";
  if (errors.username || errors.password) return;

  loading.value = true;
  try {
    await login(form.username.trim(), form.password);
    const target = String(route.query.redirect || "");
    // Hanya izinkan redirect ke path internal.
    router.replace(
      target.startsWith("/") && !target.startsWith("//")
        ? target
        : "/dashboard",
    );
  } catch (e) {
    error.value = getErrorMessage(e, "Login gagal");
  } finally {
    loading.value = false;
  }
}
</script>
