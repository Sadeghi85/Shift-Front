export interface ShiftDefinitionInputModel {
  id: number;
  title: string;
  portalId: number;
  shiftType: number;
  startTime: string;
  endTime: string;

  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
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
