interface IShiftTabletCrewInputModel {
  id?: number;
  agentId?: number;
  resourceTypeId?: number;
  entranceTime?: string | null;
  exitTime?: string | null;
  shiftTabletId?: number;
}
export class ShiftTabletCrewInputModel implements IShiftTabletCrewInputModel {
  id: number;
  agentId: number;
  resourceTypeId: number;
  entranceTime: string | null;
  exitTime: string | null;
  shiftTabletId: number;

  constructor(params: IShiftTabletCrewInputModel) {
    this.id = params.id || 0;
    this.agentId = params.agentId || 0;
    this.resourceTypeId = params.resourceTypeId || 0;
    this.entranceTime = params.entranceTime || null;
    this.exitTime = params.exitTime || null;
    this.shiftTabletId = params.shiftTabletId || 0;
  }
}

interface IShiftTabletCrewSearchModel {
  id?: number;
  title?: string;
  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
  desc?: boolean;

  agentName?: string;
  shiftTitle?: string;
  fromDate?: string;
  toDate?: string;
  agentId?: number;
  resourceTypeId?: number;
  shifTabletId?: number;
  entranceTime?: string;
  exitTime?: string;
  isReplaced?: boolean | null;
  isDeleted?: boolean | null;
}
export class ShiftTabletCrewSearchModel implements IShiftTabletCrewSearchModel {
  id: number;
  title: string;
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;

  agentName: string;
  shiftTitle: string;
  fromDate: string;
  toDate: string;
  agentId: number;
  resourceTypeId: number;
  shifTabletId: number;
  entranceTime: string;
  exitTime: string;
  isReplaced: boolean | null;
  isDeleted: boolean | null;

  constructor(params: IShiftTabletCrewSearchModel) {
    this.id = params.id || 0;
    this.title = params.title || "";
    this.pageNo = params.pageNo || 0;
    this.pageSize = params.pageSize || 10;
    this.orderKey = params.orderKey || "id";
    this.desc = params.desc || true;

    this.agentName = params.agentName || "";
    this.shiftTitle = params.shiftTitle || "";
    this.fromDate = params.fromDate || "";
    this.toDate = params.toDate || "";
    this.agentId = params.agentId || 0;
    this.resourceTypeId = params.resourceTypeId || 0;
    this.shifTabletId = params.shifTabletId || 0;
    this.entranceTime = params.entranceTime || "";
    this.exitTime = params.exitTime || "";
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
  jobName?: string;
  shiftTitle?: string;
  shiftDate?: string;
  persianDate?: string; // ShiftTabletDate
  persianWeekDay?: string;
  weekDay?: string;
  portalName?: string;
  agentId?: number;
  resourceTypeId?: number;
}
export class ShiftTabletCrewViewModel implements IShiftTabletCrewViewModel {
  id: number;

  agentFullName: string;
  entranceTime: string;
  exitTime: string;
  defaultEntranceTime: string;
  defaultExitTime: string;
  jobName: string;
  shiftTitle: string;
  shiftDate: string;
  persianDate: string; // ShiftTabletDate
  persianWeekDay: string;
  weekDay: string;
  portalName: string;
  agentId: number;
  resourceTypeId: number;

  constructor(params: IShiftTabletCrewViewModel) {
    this.id = params.id || 0;

    this.agentFullName = params.agentFullName || "";
    this.entranceTime = params.entranceTime || "";
    this.exitTime = params.exitTime || "";
    this.defaultEntranceTime = params.defaultEntranceTime || "";
    this.defaultExitTime = params.defaultExitTime || "";
    this.jobName = params.jobName || "";
    this.shiftTitle = params.shiftTitle || "";
    this.shiftDate = params.shiftDate || "";
    this.persianDate = params.persianDate || ""; // ShiftTabletDate
    this.persianWeekDay = params.persianWeekDay || "";
    this.weekDay = params.weekDay || "";
    this.portalName = params.portalName || "";
    this.agentId = params.agentId || 0;
    this.resourceTypeId = params.resourceTypeId || 0;
  }
}
