interface IShiftDefinitionTemplateInputModel {
  id?: number;
  jobId?: number;
  shiftId?: number;
}
export class ShiftDefinitionTemplateInputModel
  implements IShiftDefinitionTemplateInputModel
{
  id: number;
  jobId: number;
  shiftId: number;

  constructor(params: IShiftDefinitionTemplateInputModel) {
    this.id = params.id || 0;
    this.jobId = params.jobId || 0;
    this.shiftId = params.shiftId || 0;
  }
}

interface IShiftDefinitionTemplateSearchModel {
  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
  desc?: boolean;
  shiftId?: number;
  jobId?: number;
  isDeleted?: boolean | null;
}
export class ShiftDefinitionTemplateSearchModel
  implements IShiftDefinitionTemplateSearchModel
{
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;
  shiftId: number;
  jobId: number;
  isDeleted: boolean | null;

  constructor(params: IShiftDefinitionTemplateSearchModel) {
    this.pageNo = params.pageNo || 0;
    this.pageSize = params.pageSize || 2147483647; // Int32.MaxValue
    this.orderKey = params.orderKey || "id";
    this.desc = params.desc || true;
    this.shiftId = params.shiftId || 0;
    this.jobId = params.jobId || 0;
    this.isDeleted = params.isDeleted || false;
  }
}

interface IShiftDefinitionTemplateViewModel {
  id?: number;
  shiftId?: number;
  jobId?: number;
  shiftTitle?: string;
  jobTitle?: string;
}
export class ShiftDefinitionTemplateViewModel
  implements IShiftDefinitionTemplateViewModel
{
  id: number;
  shiftId: number;
  jobId: number;
  shiftTitle: string;
  jobTitle: string;

  constructor(params: IShiftDefinitionTemplateViewModel) {
    this.id = params.id || 0;
    this.shiftId = params.shiftId || 0;
    this.jobId = params.jobId || 0;
    this.shiftTitle = params.shiftTitle || "";
    this.jobTitle = params.jobTitle || "";
  }
}
