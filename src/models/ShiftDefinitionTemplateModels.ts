interface IShiftDefinitionTemplateInputModel {
  id?: number;
  resourceTypeId?: number;
  shiftId?: number;
  isDeleted?: boolean | null;
}
export class ShiftDefinitionTemplateInputModel
  implements IShiftDefinitionTemplateInputModel
{
  id: number;
  resourceTypeId: number;
  shiftId: number;
  isDeleted: boolean | null;

  constructor(params: IShiftDefinitionTemplateInputModel) {
    this.id = params.id || 0;
    this.resourceTypeId = params.resourceTypeId || 0;
    this.shiftId = params.shiftId || 0;
    this.isDeleted = params.isDeleted || false;
  }
}

interface IShiftDefinitionTemplateSearchModel {
  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
  desc?: boolean;
  shiftId?: number;
  resourceTypeId?: number;
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
  resourceTypeId: number;
  isDeleted: boolean | null;

  constructor(params: IShiftDefinitionTemplateSearchModel) {
    this.pageNo = params.pageNo || 0;
    this.pageSize = params.pageSize || 2147483647; // Int32.MaxValue
    this.orderKey = params.orderKey || "id";
    this.desc = params.desc || true;
    this.shiftId = params.shiftId || 0;
    this.resourceTypeId = params.resourceTypeId || 0;
    this.isDeleted = params.isDeleted || false;
  }
}

interface IShiftDefinitionTemplateViewModel {
  shiftId?: number;
  resourceId?: number;
  shiftName?: string;
  resourceTypeName?: string;
}
export class ShiftDefinitionTemplateViewModel
  implements IShiftDefinitionTemplateViewModel
{
  shiftId: number;
  resourceId: number;
  shiftName: string;
  resourceTypeName: string;

  constructor(params: IShiftDefinitionTemplateViewModel) {
    this.shiftId = params.shiftId || 0;
    this.resourceId = params.resourceId || 0;
    this.shiftName = params.shiftName || "";
    this.resourceTypeName = params.resourceTypeName || "";
  }
}
