export interface ShiftTabletCrewInputModel {
  id: number;
  agentId: number;
  resourceTypeId: number;
  entranceTime: string;
  exitTime: string;
  shiftTabletId: number;

  isReplaced?: boolean;
  agentName?: string;
  shiftTitle: string;
  fromDate?: string;
  toDate?: string;

  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
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
