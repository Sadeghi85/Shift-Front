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

export interface ShiftTabletViewModel {
  id: number;
  shiftId: number;
  shiftTitle: string;
  shiftDate: string;
  productionTypeId: number;
  productionTypeTitle: string;
  shiftWorthPercent: number;
}
