export interface ShiftTabletCrewInputModel {
  id: number;
  agentId: number;
  resourceTypeId: number;
  entranceTime: string;
  exitTime: string;
  shiftTabletId: number;

  isReplaced: boolean;
  agentName: string;
  shiftTitle: string;
  fromDate: string;
  toDate: string;

  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
}
