export interface ShiftLocationInputModel {
  title: string;
  portalId: number;
  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
}

export interface ShiftLocationViewModel {
  id: number;
  title: string;
  portalId: number;
  portalTitle: string;
}
