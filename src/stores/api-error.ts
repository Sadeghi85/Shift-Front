import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { ref } from "vue";

const useApiErrorStore = defineStore({
  id: "api-error",
  state: () => ({
    apiErrorMessage: ref(""),
  }),
  getters: {
    getApiErrorMessage: (state) => state.apiErrorMessage,
  },
  actions: {
    setApiErrorMessage(apiErrorMessage: string) {
      this.apiErrorMessage = apiErrorMessage;
    },
    removeApiErrorMessage() {
      this.apiErrorMessage = "";
    },
  },
});

export default useApiErrorStore;
