export interface ShiftTabletInputModel {
  id: number;
  shiftId: number;
  productionTypeId: number;
  shiftTime: string;
  shiftDate: string;
  shiftWorthPercent: number;
  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
}
