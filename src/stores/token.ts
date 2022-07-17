import { defineStore } from "pinia";
import { ITokenViewModel } from "@/models/TokenModels";

const useTokenStore = defineStore({
  id: "token",
  state: () => ({
    token: ref<ITokenViewModel | null>(),
  }),
  getters: {},
  actions: {
    setToken(token: ITokenViewModel | null) {
      this.token = token;
    },
    removeToken() {
      this.token = null;
    },
  },
});

export default useTokenStore;
