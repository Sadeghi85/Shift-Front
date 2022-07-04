export interface ShiftTabletInputModel {
  id: number;
  shiftId: number;
  shiftTime: string;
  shiftDate: string;
  shiftWorthPercent: string;
  hasLivePrograms: boolean;
}

export interface ShiftTabletSearchModel {
  id: number;
  shiftId: number;
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;
  isDeleted: boolean | null;
  fromDate: string;
  toDate: string;
}

export interface ShiftTabletViewModel {
  id: number;
  shiftId: number;
  shiftTitle: string;
  shiftDate: string;
  shiftWorthPercent: string;
  portalId: number;
  portalName: string;
  shiftStartTime: string;
  shiftEndTime: string;
}
