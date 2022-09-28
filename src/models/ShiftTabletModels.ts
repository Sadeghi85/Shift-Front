interface IShiftTabletInputModel {
  id?: number;
  shiftId?: number;
  locationId?: number;
  shiftWorthPercent?: string;
  hasLivePrograms?: boolean;
}
interface IShiftTabletCreateModel extends IShiftTabletInputModel {
  shiftDateFrom?: string;
  shiftDateTo?: string;
}
interface IShiftTabletUpdateModel extends IShiftTabletInputModel {
  shiftDate?: string;
}

export class ShiftTabletCreateModel implements IShiftTabletCreateModel {
  id: number;
  shiftId: number;
  locationId: number;
  shiftDateFrom: string;
  shiftDateTo: string;
  shiftWorthPercent: string;
  hasLivePrograms: boolean;

  constructor(input: IShiftTabletCreateModel) {
    this.id = input.id || 0;
    this.shiftId = input.shiftId || 0;
    this.locationId = input.locationId || 0;
    this.shiftDateFrom = input.shiftDateFrom || "";
    this.shiftDateTo = input.shiftDateTo || "";
    this.shiftWorthPercent = input.shiftWorthPercent || "0";
    this.hasLivePrograms = input.hasLivePrograms || false;
  }
}

export class ShiftTabletUpdateModel implements IShiftTabletUpdateModel {
  id: number;
  shiftId: number;
  locationId: number;
  shiftDate: string;
  shiftWorthPercent: string;
  hasLivePrograms: boolean;

  constructor(input: IShiftTabletUpdateModel) {
    this.id = input.id || 0;
    this.shiftId = input.shiftId || 0;
    this.locationId = input.locationId || 0;
    this.shiftDate = input.shiftDate || "";
    this.shiftWorthPercent = input.shiftWorthPercent || "0";
    this.hasLivePrograms = input.hasLivePrograms || false;
  }
}

interface IShiftTabletSearchModel {
  id?: number;
  shiftId?: number;
  portalId?: number;
  agentId?: number;
  locationId?: number;
  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
  desc?: boolean;
  isDeleted?: boolean | null;
  fromDate?: string | null;
  toDate?: string | null;
}
export class ShiftTabletSearchModel implements IShiftTabletSearchModel {
  id: number;
  shiftId: number;
  portalId: number;
  agentId: number;
  locationId: number;
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;
  isDeleted: boolean | null;
  fromDate: string | null;
  toDate: string | null;

  constructor(input: IShiftTabletSearchModel) {
    this.id = input.id || 0;
    this.shiftId = input.shiftId || 0;
    this.portalId = input.portalId || 0;
    this.agentId = input.agentId || 0;
    this.locationId = input.locationId || 0;
    this.pageNo = input.pageNo || 0;
    this.pageSize = input.pageSize || 10;
    this.orderKey = input.orderKey || "id";
    this.desc = input.desc || true;
    this.isDeleted = input.isDeleted || false;
    this.fromDate = input.fromDate || null;
    this.toDate = input.toDate || null;
  }
}

interface IShiftTabletViewModel {
  id?: number;
  shiftId?: number;
  shiftTitle?: string;
  shiftDate?: string;
  shiftWorthPercent?: string;
  hasLivePrograms?: boolean;
  portalId?: number;
  portalTitle?: string;
  locationId?: number;
  locationTitle?: string;
  shiftStartTime?: string;
  shiftEndTime?: string;
  shiftDuration?: string;
}
export class ShiftTabletViewModel implements IShiftTabletViewModel {
  id: number;
  shiftId: number;
  shiftTitle: string;
  shiftDate: string;
  shiftWorthPercent: string;
  hasLivePrograms: boolean;
  portalId: number;
  portalTitle: string;
  locationId: number;
  locationTitle: string;
  shiftStartTime: string;
  shiftEndTime: string;
  shiftDuration: string;

  constructor(input: IShiftTabletViewModel) {
    this.id = input.id || 0;
    this.shiftId = input.shiftId || 0;
    this.shiftTitle = input.shiftTitle || "";
    this.shiftDate = input.shiftDate || "";
    this.shiftWorthPercent = input.shiftWorthPercent || "";
    this.hasLivePrograms = input.hasLivePrograms || false;
    this.portalId = input.portalId || 0;
    this.portalTitle = input.portalTitle || "";
    this.locationId = input.locationId || 0;
    this.locationTitle = input.locationTitle || "";
    this.shiftStartTime = input.shiftStartTime || "";
    this.shiftEndTime = input.shiftEndTime || "";
    this.shiftDuration = input.shiftDuration || "";
  }
}
