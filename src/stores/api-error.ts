import { defineStore } from "pinia";

const useApiErrorStore = defineStore({
  id: "api-error",
  state: () => ({
    apiErrorMessage: ref(""),
  }),
  getters: {},
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
