<script lang="ts" setup>
import { storeToRefs } from "pinia";
import useApiErrorStore from "@/stores/api-error";

const { t } = useI18n();
const toast = useToast();
const apiErrorStore = useApiErrorStore();
const { apiErrorMessage } = storeToRefs(apiErrorStore);

watch(apiErrorMessage, (newValue) => {
  if (newValue) {
    showError(newValue);
    apiErrorStore.removeApiErrorMessage();
  }
});

const showError = (detail: string) => {
  toast.add({
    severity: "error",
    summary: t("toast.header.general"),
    detail: detail.replace(/[<>]/g, "").replace(/\n/g, "<br><br>"),
    life: 3000,
    group: "apiError",
  });
};
</script>

<template>
  <nav>
    <router-link
      :to="{
        name: 'locations',
      }"
      >{{ t("route.locations") }}</router-link
    >
    |
    <router-link
      :to="{
        name: 'portal-locations',
      }"
      >{{ t("route.portal-locations") }}</router-link
    >
    |
    <router-link
      :to="{
        name: 'shift-definition',
      }"
      >{{ t("route.shift-definition") }}</router-link
    >
    |
    <router-link
      :to="{
        name: 'shift-tablet',
      }"
      >{{ t("route.shift-tablet") }}</router-link
    >
  </nav>
  <router-view />

  <!-- <Toast position="top-center" group="apiError" /> -->

  <Toast position="top-center" group="apiError" :style="{ width: '50vw' }">
    <template #message="slotProps">
      <span class="p-toast-message-icon pi pi-times"></span>
      <div class="p-toast-message-text">
        <span class="p-toast-summary">{{ slotProps.message.summary }}</span>
        <div class="p-toast-detail" v-html="slotProps.message.detail" />
      </div>
    </template>
  </Toast>
</template>

<style></style>
