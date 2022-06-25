export interface ShiftTabletInputModel {
  id: number;
  shiftId: number;
  productionTypeId: number;
  shiftTime: string;
  shiftDate: string;
  shiftWorthPercent: string;
}

export interface ShiftTabletSearchModel {
  id: number;
  shiftId: number;
  productionTypeId: number;
  shiftDate: string;
  shiftWorthPercent: string;
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;
  isDeleted: boolean | null;
}

export interface ShiftTabletViewModel {
  id: number;
  shiftId: number;
  shiftTitle: string;
  shiftDate: string;
  productionTypeId: number;
  productionTypeTitle: string;
  shiftWorthPercent: string;
  portalName: string;
  shiftStartTime: string;
  shiftEndTime: string;
}
