export interface ResourceTypeViewModel {
  id: number;
  parentId: number;
  title: string;
}

export interface ResourceTypeSearchModel {
  id: number;
  resourceName: string;
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;
}
