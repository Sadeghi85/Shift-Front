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
