interface IShiftTabletCrewInputModel {
  id?: number;
  agentId?: number;
  jobId?: number;
  roleTypeId?: number;
  shiftTabletId?: number;
  entranceTime?: string | null;
  exitTime?: string | null;
}
export class ShiftTabletCrewInputModel implements IShiftTabletCrewInputModel {
  id: number;
  agentId: number;
  jobId: number;
  roleTypeId: number;
  shiftTabletId: number;
  entranceTime: string | null;
  exitTime: string | null;

  constructor(params: IShiftTabletCrewInputModel) {
    this.id = params.id || 0;
    this.agentId = params.agentId || 0;
    this.jobId = params.jobId || 0;
    this.roleTypeId = params.roleTypeId || 0;
    this.shiftTabletId = params.shiftTabletId || 0;
    this.entranceTime = params.entranceTime || null;
    this.exitTime = params.exitTime || null;
  }
}

interface IShiftTabletCrewSearchModel {
  id?: number;
  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
  desc?: boolean;

  agentName?: string;
  shiftTitle?: string;
  fromDate?: string | null;
  toDate?: string | null;
  agentId?: number;
  jobId?: number;
  roleTypeId?: number;
  shiftTabletId?: number;
  shiftId?: number;
  isReplaced?: boolean | null;
  isDeleted?: boolean | null;
}
export class ShiftTabletCrewSearchModel implements IShiftTabletCrewSearchModel {
  id: number;
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;

  agentName: string;
  shiftTitle: string;
  fromDate: string | null;
  toDate: string | null;
  agentId: number;
  jobId: number;
  roleTypeId: number;
  shiftTabletId: number;
  shiftId: number;
  isReplaced: boolean | null;
  isDeleted: boolean | null;

  constructor(params: IShiftTabletCrewSearchModel) {
    this.id = params.id || 0;
    this.pageNo = params.pageNo || 0;
    this.pageSize = params.pageSize || 10;
    this.orderKey = params.orderKey || "id";
    this.desc = params.desc || true;

    this.agentName = params.agentName || "";
    this.shiftTitle = params.shiftTitle || "";
    this.fromDate = params.fromDate || null;
    this.toDate = params.toDate || null;
    this.agentId = params.agentId || 0;
    this.jobId = params.jobId || 0;
    this.roleTypeId = params.roleTypeId || 0;
    this.shiftTabletId = params.shiftTabletId || 0;
    this.shiftId = params.shiftId || 0;
    this.isReplaced = params.isReplaced || null;
    this.isDeleted = params.isDeleted || false;
  }
}

interface IShiftTabletCrewViewModel {
  id?: number;

  agentFullName?: string;
  entranceTime?: string;
  exitTime?: string;
  defaultEntranceTime?: string;
  defaultExitTime?: string;
  jobTitle?: string;
  shiftTitle?: string;
  shiftDate?: string;
  shiftDatePersian?: string; // ShiftTabletDate
  persianWeekDay?: string;
  weekDay?: string;
  portalTitle?: string;
  agentId?: number;
  jobId?: number;
}
export class ShiftTabletCrewViewModel implements IShiftTabletCrewViewModel {
  id: number;

  agentFullName: string;
  entranceTime: string;
  exitTime: string;
  defaultEntranceTime: string;
  defaultExitTime: string;
  jobTitle: string;
  shiftTitle: string;
  shiftDate: string;
  shiftDatePersian: string; // ShiftTabletDate
  persianWeekDay: string;
  weekDay: string;
  portalTitle: string;
  agentId: number;
  jobId: number;

  constructor(params: IShiftTabletCrewViewModel) {
    this.id = params.id || 0;

    this.agentFullName = params.agentFullName || "";
    this.entranceTime = params.entranceTime || "";
    this.exitTime = params.exitTime || "";
    this.defaultEntranceTime = params.defaultEntranceTime || "";
    this.defaultExitTime = params.defaultExitTime || "";
    this.jobTitle = params.jobTitle || "";
    this.shiftTitle = params.shiftTitle || "";
    this.shiftDate = params.shiftDate || "";
    this.shiftDatePersian = params.shiftDatePersian || ""; // ShiftTabletDate
    this.persianWeekDay = params.persianWeekDay || "";
    this.weekDay = params.weekDay || "";
    this.portalTitle = params.portalTitle || "";
    this.agentId = params.agentId || 0;
    this.jobId = params.jobId || 0;
  }
}
