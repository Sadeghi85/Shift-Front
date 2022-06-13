<template>
  <nav>
    <router-link
      :to="{
        name: 'shift-location',
      }"
      >تعریف لوکیشن</router-link
    >
    | <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <router-view />
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeMount } from "vue";

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
