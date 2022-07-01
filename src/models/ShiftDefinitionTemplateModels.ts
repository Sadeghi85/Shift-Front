export interface ShiftDefinitionTemplateInputModel {
  id: number;
  resourceTypeId: number;
  shiftId: number;
  isDeleted: boolean | null;
}

export interface ShiftDefinitionTemplateSearchModel {
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;
  shiftId: number;
  resourceTypeId: number;
  isDeleted: boolean | null;
}

export interface ShiftDefinitionTemplateViewModel {
  shiftId: number;
  resourceId: number;
  shiftName: string;
  resourceTypeName: string;
}
