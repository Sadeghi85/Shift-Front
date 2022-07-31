interface IJobSearchModel {
  id?: number;
  title?: string;
  isDeleted?: boolean | null;
  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
  desc?: boolean;
}
export class JobSearchModel implements IJobSearchModel {
  id: number;
  title: string;
  isDeleted: boolean | null;
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;

  constructor(params: IJobSearchModel) {
    this.id = params.id || 0;
    this.title = params.title || "";
    this.isDeleted = params.isDeleted || false;
    this.pageNo = params.pageNo || 0;
    this.pageSize = params.pageSize || 10;
    this.orderKey = params.orderKey || "id";
    this.desc = params.desc || true;
  }
}

interface IJobViewModel {
  id?: number;
  title?: string;
}
export class JobViewModel implements IJobViewModel {
  id: number;
  title: string;

  constructor(params: IJobViewModel) {
    this.id = params.id || 0;
    this.title = params.title || "";
  }
}
