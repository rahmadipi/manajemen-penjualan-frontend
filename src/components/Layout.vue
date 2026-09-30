<template>
  <div class="min-h-screen lg:flex">
    <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    <div class="flex min-w-0 flex-1 flex-col">
      <Navbar
        :title="route.meta.title || 'Admin Penjualan'"
        @toggle="sidebarOpen = true"
        @logout="logout"
      />
      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <div class="mx-auto max-w-6xl">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Sidebar from "./Sidebar.vue";
import Navbar from "./Navbar.vue";
import { clearSession } from "../services/session";
import { useToast } from "../composables/useToast";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const sidebarOpen = ref(false);

function logout() {
  clearSession();
  toast.info("Anda telah keluar.");
  router.replace("/login");
}
</script>
