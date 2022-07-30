interface IPortalLocationInputModel {
  id?: number;
  portalId?: number;
  locationId?: number;
}
export class PortalLocationInputModel implements IPortalLocationInputModel {
  id: number;
  portalId: number;
  locationId: number;

  constructor(params: IPortalLocationInputModel) {
    this.id = params.id || 0;
    this.portalId = params.portalId || 0;
    this.locationId = params.locationId || 0;
  }
}

interface IPortalLocationSearchModel {
  id?: number;
  portalId?: number;
  locationId?: number;
  isDeleted?: boolean | null;

  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
  desc?: boolean;
}
export class PortalLocationSearchModel implements IPortalLocationSearchModel {
  id: number;
  portalId: number;
  locationId: number;
  isDeleted: boolean | null;

  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;

  constructor(params: IPortalLocationSearchModel) {
    this.id = params.id || 0;
    this.portalId = params.portalId || 0;
    this.locationId = params.locationId || 0;
    this.isDeleted = params.isDeleted || false;

    this.pageNo = params.pageNo || 0;
    this.pageSize = params.pageSize || 10;
    this.orderKey = params.orderKey || "id";
    this.desc = params.desc || true;
  }
}

interface IPortalLocationViewModel {
  id?: number;
  portalId?: number;
  locationId?: number;
  portalTitle?: string;
  locationTitle?: string;
  isDeleted?: boolean;
}
export class PortalLocationViewModel implements IPortalLocationViewModel {
  id: number;
  portalId: number;
  locationId: number;
  portalTitle: string;
  locationTitle: string;
  isDeleted: boolean;

  constructor(params: IPortalLocationViewModel) {
    this.id = params.id || 0;
    this.portalId = params.portalId || 0;
    this.locationId = params.locationId || 0;
    this.portalTitle = params.portalTitle || "";
    this.locationTitle = params.locationTitle || "";
    this.isDeleted = params.isDeleted || true;
  }
}
