interface ILocationInputModel {
  id?: number;
  title?: string;
}
export class LocationInputModel implements ILocationInputModel {
  id: number;
  title: string;

  constructor(params: ILocationInputModel) {
    this.id = params.id || 0;
    this.title = params.title || "";
  }
}

interface ILocationSearchModel {
  id?: number;
  title?: string;
  isDeleted?: boolean | null;

  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
  desc?: boolean;
}
export class LocationSearchModel implements ILocationSearchModel {
  id: number;
  title: string;
  isDeleted: boolean | null;

  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;

  constructor(params: ILocationSearchModel) {
    this.id = params.id || 0;
    this.title = params.title || "";
    this.isDeleted = params.isDeleted || false;

    this.pageNo = params.pageNo || 0;
    this.pageSize = params.pageSize || 10;
    this.orderKey = params.orderKey || "id";
    this.desc = params.desc || true;
  }
}

interface ILocationViewModel {
  id?: number;
  title?: string;
  isDeleted?: boolean;
}
export class LocationViewModel implements ILocationViewModel {
  id: number;
  title: string;
  isDeleted: boolean;

  constructor(params: ILocationViewModel) {
    this.id = params.id || 0;
    this.title = params.title || "";
    this.isDeleted = params.isDeleted || true;
  }
}
