import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { PortalViewModel } from "@/models/PortalViewModel";
import { ref } from "vue";

export const usePortalStore = defineStore({
  id: "portal",
  state: () => ({
    portals: useStorage<PortalViewModel[]>("portals", []),
  }),
  getters: {
    getPortals: (state) => state.portals,
  },
  actions: {
    setPortals(portals: PortalViewModel[]) {
      this.portals = portals;
    },
    removePortals() {
      this.portals = [];
    },
  },
});
