import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { ref } from "vue";
import { TokenViewModel } from "@/models/TokenModels";

const useTokenStore = defineStore({
  id: "token",
  state: () => ({
    token: ref<TokenViewModel | null>(),
  }),
  getters: {},
  actions: {
    setToken(token: TokenViewModel | null) {
      this.token = token;
    },
    removeToken() {
      this.token = null;
    },
  },
});

export default useTokenStore;
