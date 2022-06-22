export interface ShiftDefinitionInputModel {
  id: number;
  title: string;
  portalId: number;
  shiftType: number;
  startTime: string;
  endTime: string;
}

export interface ShiftDefinitionSearchModel {
  id: number;
  portalId: number;
  shiftType: number;
  title: string;
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;
}

export interface ShiftDefinitionViewModel {
  id: number;
  title: string;
  portalId: number;
  portalTitle: string;
  startTime: string;
  endTime: string;
  shiftTypeTitle: string;
}
