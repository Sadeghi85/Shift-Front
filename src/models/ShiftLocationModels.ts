export interface ShiftLocationInputModel {
  id: number;
  title: string;
  portalId: number;
}

export interface ShiftLocationSearchModel {
  id: number;
  title: string;
  portalId?: number;
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;
  isDeleted: boolean | null;
}

export interface ShiftLocationViewModel {
  id: number;
  title: string;
  portalId: number;
  portalTitle: string;
}
