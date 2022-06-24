export interface PortalViewModel {
  id: number;
  title: string;
}

export interface PortalSearchModel {
  portalId: number;
  title: string;

  pageNo: number;
  pageSize: number;
  orderKey: string;
}
