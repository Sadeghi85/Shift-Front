import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { ref } from "vue";

export const useGeneralStore = defineStore({
  id: "general",
  state: () => ({
    rowPerPage: useStorage<number>("rowPerPage", 10),
  }),
  getters: {},
  actions: {},
});
