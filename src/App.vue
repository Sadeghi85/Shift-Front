<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link
      :to="{
        name: 'shift-location',
      }"
      >تعریف لوکیشن</router-link
    >
  </nav>
  <router-view />
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeMount } from "vue";
import { InitialCalls } from "@/http-client/initial-calls";
import { Api } from "./http-client/api";
import { usePortalStore } from "./stores/portal";

const api = Api.getInstance();
const portalStore = usePortalStore();

// reactive state
const count = ref(0);

// functions that mutate state and trigger updates
function increment() {
  count.value++;
}

// lifecycle hooks
onBeforeMount(() => {
  //console.log(`The initial count is ${count.value}.`);
  //new InitialCalls();

  api
    .getPortals()
    .then((response) => {
      //console.log(response);
      if (!response.data.success) {
        throw new Error(
          "Failed api call: [" + response.data.failureMessage + "]"
        );
      }

      portalStore.setPortals(response.data.data);
    })
    .catch((error) => {
      console.log(error);
    });
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
