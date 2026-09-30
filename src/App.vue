<template>
  <router-view />
  <ConfirmDialog />
  <ToastContainer />
</template>

<script setup>
import ConfirmDialog from "./components/ConfirmDialog.vue";
import ToastContainer from "./components/ToastContainer.vue";
</script>
