import { defineStore } from "pinia";

export const useGeneralStore = defineStore({
  id: "general",
  state: () => ({
    // grid paginator
    rowPerPage: useStorage<number>("rowPerPage", 10),

    // dropdown
    dropdownItemsCount: 20,
  }),
  getters: {},
  actions: {},
});
