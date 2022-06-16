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
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeMount } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// reactive state
const count = ref(0);

// functions that mutate state and trigger updates
function increment() {
  count.value++;
}

// lifecycle hooks
onBeforeMount(() => {
  //console.log(`The initial count is ${count.value}.`);
});
</script>

<style></style>
