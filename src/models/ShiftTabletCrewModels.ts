export interface ShiftTabletCrewInputModel {
  id: number;
  agentId: number;
  resourceTypeId: number;
  entranceTime: string | null;
  exitTime: string | null;
  shiftTabletId: number;
}

export interface ShiftTabletCrewSearchModel {
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
}

export interface ShiftTabletCrewViewModel {
  id: number;

  agentFullName: string;
  entranceTime: string;
  exitTime: string;
  jobName: string;
  shiftTitle: string;
  shiftDate: string;
  persianDate: string; // ShiftTabletDate
  persianWeekDay: string;
  weekDay: string;
  portalName: string;
}
