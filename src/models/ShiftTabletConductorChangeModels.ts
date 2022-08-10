interface IShiftTabletConductorChangeInputModel {
  id?: number;
  shiftTabletId?: number;
  roleTypeId?: number;
  oldProgramTitle?: string;
  newProgramTitle?: string;
  description?: string;
}
export class ShiftTabletConductorChangeInputModel
  implements IShiftTabletConductorChangeInputModel
{
  id: number;
  shiftTabletId: number;
  roleTypeId: number;
  oldProgramTitle: string;
  newProgramTitle: string;
  description: string;

  constructor(params: IShiftTabletConductorChangeInputModel) {
    this.id = params.id || 0;
    this.shiftTabletId = params.shiftTabletId || 0;
    this.roleTypeId = params.roleTypeId || 0;
    this.oldProgramTitle = params.oldProgramTitle || "";
    this.newProgramTitle = params.newProgramTitle || "";
    this.description = params.description || "";
  }
}

interface IShiftTabletConductorChangeSearchModel {
  id?: number;
  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
  desc?: boolean;

  shiftTabletId?: number;
  roleTypeId?: number;
  isDeleted?: boolean | null;
}
export class ShiftTabletConductorChangeSearchModel
  implements IShiftTabletConductorChangeSearchModel
{
  id: number;
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;

  shiftTabletId: number;
  roleTypeId: number;
  isDeleted: boolean | null;

  constructor(params: IShiftTabletConductorChangeSearchModel) {
    this.id = params.id || 0;
    this.pageNo = params.pageNo || 0;
    this.pageSize = params.pageSize || 2147483647; // Int32.MaxValue
    this.orderKey = params.orderKey || "id";
    this.desc = params.desc || true;

    this.shiftTabletId = params.shiftTabletId || 0;
    this.roleTypeId = params.roleTypeId || 0;
    this.isDeleted = params.isDeleted || false;
  }
}

interface IShiftTabletConductorChangeViewModel {
  id?: number;

  shiftTabletId?: number;
  roleTypeId?: number;
  oldProgramTitle?: string;
  newProgramTitle?: string;
  description?: string;
}
export class ShiftTabletConductorChangeViewModel
  implements IShiftTabletConductorChangeViewModel
{
  id: number;

  shiftTabletId: number;
  roleTypeId: number;
  oldProgramTitle: string;
  newProgramTitle: string;
  description: string;

  constructor(params: IShiftTabletConductorChangeViewModel) {
    this.id = params.id || 0;

    this.shiftTabletId = params.shiftTabletId || 0;
    this.roleTypeId = params.roleTypeId || 0;
    this.oldProgramTitle = params.oldProgramTitle || "";
    this.newProgramTitle = params.newProgramTitle || "";
    this.description = params.description || "";
  }
}
