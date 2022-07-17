interface IShiftLocationInputModel {
  id?: number;
  title?: string;
  portalId?: number;
}
export class ShiftLocationInputModel implements IShiftLocationInputModel {
  id: number;
  title: string;
  portalId: number;

  constructor(params: IShiftLocationInputModel) {
    this.id = params.id || 0;
    this.title = params.title || "";
    this.portalId = params.portalId || 0;
  }
}

interface IShiftLocationSearchModel {
  id?: number;
  title?: string;
  portalId?: number;
  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
  desc?: boolean;
  isDeleted?: boolean | null;
}
export class ShiftLocationSearchModel implements IShiftLocationSearchModel {
  id: number;
  title: string;
  portalId: number;
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;
  isDeleted: boolean | null;

  constructor(params: IShiftLocationSearchModel) {
    this.id = params.id || 0;
    this.title = params.title || "";
    this.portalId = params.portalId || 0;
    this.pageNo = params.pageNo || 0;
    this.pageSize = params.pageSize || 10;
    this.orderKey = params.orderKey || "id";
    this.desc = params.desc || true;
    this.isDeleted = params.isDeleted || false;
  }
}

interface IShiftLocationViewModel {
  id?: number;
  title?: string;
  portalId?: number;
  portalTitle?: string;
}
export class ShiftLocationViewModel implements IShiftLocationViewModel {
  id: number;
  title: string;
  portalId: number;
  portalTitle: string;

  constructor(params: IShiftLocationViewModel) {
    this.id = params.id || 0;
    this.title = params.title || "";
    this.portalId = params.portalId || 0;
    this.portalTitle = params.portalTitle || "";
  }
}
