import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { PortalModel } from "@/models/PortalModel";
import { ref } from "vue";

export const usePortalStore = defineStore({
  id: "portal",
  state: () => ({
    portals: useStorage<PortalModel[]>("portals", []),
  }),
  getters: {
    getPortals: (state) => state.portals,
  },
  actions: {
    setPortals(portals: PortalModel[]) {
      this.portals = portals;
    },
    removePortals() {
      this.portals = [];
    },
  },
});
