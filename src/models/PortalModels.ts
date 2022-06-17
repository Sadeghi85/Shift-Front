export interface PortalViewModel {
  id: number;
  title: string;
}

export interface PortalInputModel {
  portalId: number;
  title: string;

  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
}
