export interface ShiftLocationInputModel {
  title: string;
  portalId: number;
}

export interface ShiftLocationSearchModel {
  id: number;
  title?: string;
  portalId?: number;
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;
}

export interface ShiftLocationViewModel {
  id: number;
  title: string;
  portalId: number;
  portalTitle: string;
}
