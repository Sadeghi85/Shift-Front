interface IShiftTabletInputModel {
  id?: number;
  shiftId?: number;
  shiftTime?: string;
  shiftDate?: string;
  shiftWorthPercent?: string;
  hasLivePrograms?: boolean;
}
export class ShiftTabletInputModel implements IShiftTabletInputModel {
  id: number;
  shiftId: number;
  shiftTime: string;
  shiftDate: string;
  shiftWorthPercent: string;
  hasLivePrograms: boolean;

  constructor(input: IShiftTabletInputModel) {
    this.id = input.id || 0;
    this.shiftId = input.shiftId || 0;
    this.shiftTime = input.shiftTime || "00:00:00";
    this.shiftDate = input.shiftDate || "";
    this.shiftWorthPercent = input.shiftWorthPercent || "";
    this.hasLivePrograms = input.hasLivePrograms || false;
  }
}

interface IShiftTabletSearchModel {
  id?: number;
  shiftId?: number;
  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
  desc?: boolean;
  isDeleted?: boolean | null;
  fromDate?: string;
  toDate?: string;
}
export class ShiftTabletSearchModel implements IShiftTabletSearchModel {
  id: number;
  shiftId: number;
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;
  isDeleted: boolean | null;
  fromDate: string;
  toDate: string;

  constructor(input: IShiftTabletSearchModel) {
    this.id = input.id || 0;
    this.shiftId = input.shiftId || 0;
    this.pageNo = input.pageNo || 0;
    this.pageSize = input.pageSize || 10;
    this.orderKey = input.orderKey || "id";
    this.desc = input.desc || true;
    this.isDeleted = input.isDeleted || false;
    this.fromDate = input.fromDate || "";
    this.toDate = input.toDate || "";
  }
}

interface IShiftTabletViewModel {
  id?: number;
  shiftId?: number;
  shiftTitle?: string;
  shiftDate?: string;
  shiftWorthPercent?: string;
  portalId?: number;
  portalName?: string;
  shiftStartTime?: string;
  shiftEndTime?: string;
}
export class ShiftTabletViewModel implements IShiftTabletViewModel {
  id: number;
  shiftId: number;
  shiftTitle: string;
  shiftDate: string;
  shiftWorthPercent: string;
  portalId: number;
  portalName: string;
  shiftStartTime: string;
  shiftEndTime: string;

  constructor(input: IShiftTabletViewModel) {
    this.id = input.id || 0;
    this.shiftId = input.shiftId || 0;
    this.shiftTitle = input.shiftTitle || "";
    this.shiftDate = input.shiftDate || "";
    this.shiftWorthPercent = input.shiftWorthPercent || "";
    this.portalId = input.portalId || 0;
    this.portalName = input.portalName || "";
    this.shiftStartTime = input.shiftStartTime || "";
    this.shiftEndTime = input.shiftEndTime || "";
  }
}
