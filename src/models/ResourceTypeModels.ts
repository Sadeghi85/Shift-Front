interface IResourceTypeViewModel {
  id?: number;
  parentId?: number;
  title?: string;
}
export class ResourceTypeViewModel implements IResourceTypeViewModel {
  id: number;
  parentId: number;
  title: string;

  constructor(params: IResourceTypeViewModel) {
    this.id = params.id || 0;
    this.parentId = params.parentId || 0;
    this.title = params.title || "";
  }
}

interface IResourceTypeSearchModel {
  id?: number;
  resourceName?: string;
  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
  desc?: boolean;
}
export class ResourceTypeSearchModel implements IResourceTypeSearchModel {
  id: number;
  resourceName: string;
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;

  constructor(params: IResourceTypeSearchModel) {
    this.id = params.id || 0;
    this.resourceName = params.resourceName || "";
    this.pageNo = params.pageNo || 0;
    this.pageSize = params.pageSize || 10;
    this.orderKey = params.orderKey || "id";
    this.desc = params.desc || true;
  }
}
