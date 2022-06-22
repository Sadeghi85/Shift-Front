<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import useApiErrorStore from "@/stores/api-error";
import { useI18n } from "vue-i18n";
import { useToast } from "primevue/usetoast";

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
    detail: detail,
    life: 3000,
    group: "apiError",
  });
};
</script>

<template>
  <nav>
    <router-link
      :to="{
        name: 'shift-location',
      }"
      >{{ t("route.shift-location") }}</router-link
    >
    |
    <router-link
      :to="{
        name: 'shift-production-type',
      }"
      >{{ t("route.shift-production-type") }}</router-link
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
    |
    <router-link
      :to="{
        name: 'shift-tablet-crew',
      }"
      >{{ t("route.shift-tablet-crew") }}</router-link
    >
  </nav>
  <router-view />

  <Toast position="top-center" group="apiError" />
</template>

<style></style>
