<script lang="ts" setup>
import DOMPurify from "dompurify";
import { storeToRefs } from "pinia";
import useApiErrorStore from "@/stores/api-error";

const { t } = useI18n();
const toast = useToast();
const apiErrorStore = useApiErrorStore();
const { apiErrorMessage } = storeToRefs(apiErrorStore);

const topHeight = computed(() => {
  return process.env.NODE_ENV === "development" ? "70px" : "0px";
});

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
    detail: DOMPurify.sanitize(detail.replace(/\n/g, "<br><br>")),
    life: 3000,
    group: "apiError",
  });
};
</script>

<template>
  <div id="top"></div>

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
        name: 'portal-settings',
      }"
      >{{ t("route.portal-settings") }}</router-link
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
        name: 'payment',
      }"
      >{{ t("route.payment") }}</router-link
    >
    |
    <router-link
      :to="{
        name: 'shift-tablet-full-calendar',
      }"
      >{{ t("route.shift-tablet-full-calendar") }}</router-link
    >
  </nav>

  <router-view v-slot="{ Component }">
    <!-- <keep-alive> -->
    <component :is="Component" />
    <!-- </keep-alive> -->
  </router-view>

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

<style lang="scss">
#top {
  height: v-bind("topHeight");
}
</style>
