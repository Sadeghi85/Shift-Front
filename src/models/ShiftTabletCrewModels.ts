export interface ShiftTabletCrewInputModel {
  id: number;
  agentId: number;
  resourceTypeId: number;
  entranceTime: string;
  exitTime: string;
  shiftTabletId: number;
}

export interface ShiftTabletCrewSearchModel {
  id: number;
  title?: string;
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;

  isReplaced?: boolean;
  agentName?: string;
  shiftTitle: string;
  fromDate?: string;
  toDate?: string;
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
