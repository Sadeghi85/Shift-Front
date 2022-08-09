import { defineStore } from "pinia";
import { ITokenViewModel } from "@/models/TokenModels";
import { IUserViewModel } from "@/models/UserModels";

const useUserStore = defineStore({
  id: "user",
  state: () => ({
    token: ref<ITokenViewModel | null>(),
    user: ref<IUserViewModel | null>(),
  }),
  getters: {},
  actions: {
    setToken(token: ITokenViewModel | null) {
      this.token = token;
    },
    removeToken() {
      this.token = null;
    },

    setUser(user: IUserViewModel | null) {
      this.user = user;
    },
    removeUser() {
      this.user = null;
    },
  },
});

export default useUserStore;
