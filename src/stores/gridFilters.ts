import { defineStore } from "pinia";

interface ShiftTabletGridFilter {
  dateRange: string[];
}

export const useGridFiltersStore = defineStore({
  id: "gridFilters",
  state: () => ({
    shiftTabletGridFilter: useStorage<ShiftTabletGridFilter>(
      "shiftTabletGridFilter",
      { dateRange: [] } as ShiftTabletGridFilter
    ),
  }),
  getters: {},
  actions: {
    setShiftTabletGridFilter(shiftTabletGridFilter: ShiftTabletGridFilter) {
      this.shiftTabletGridFilter.dateRange = shiftTabletGridFilter.dateRange;
    },
  },
});
