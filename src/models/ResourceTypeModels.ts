export interface ResourceTypeInputModel {
  id: number;
  resourceName: string;

  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
}

export interface ResourceTypeViewModel {
  id: number;
  parentId: number;
  title: string;
}
