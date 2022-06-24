export interface ShiftProductionTypeInputModel {
  id: number;
  title: string;
}

export interface ShiftProductionTypeViewModel {
  id: number;
  title: string;
}

export interface ShiftProductionTypeSearchModel {
  id: number;
  title: string;
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;
}
