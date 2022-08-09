interface IShiftTabletReportInputModel {
  id?: number;
  shiftTabletId?: number;
  roleTypeId?: number;
  reportDescription?: string;
}
export class ShiftTabletReportInputModel
  implements IShiftTabletReportInputModel
{
  id: number;
  shiftTabletId: number;
  roleTypeId: number;
  reportDescription: string;

  constructor(params: IShiftTabletReportInputModel) {
    this.id = params.id || 0;
    this.shiftTabletId = params.shiftTabletId || 0;
    this.roleTypeId = params.roleTypeId || 0;
    this.reportDescription = params.reportDescription || "";
  }
}

interface IShiftTabletReportSearchModel {
  id?: number;
  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
  desc?: boolean;

  shiftTabletId?: number;
  roleTypeId?: number;
  reportDescription?: string;
  isDeleted?: boolean | null;
}
export class ShiftTabletReportSearchModel
  implements IShiftTabletReportSearchModel
{
  id: number;
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;

  shiftTabletId: number;
  roleTypeId: number;
  isDeleted: boolean | null;

  constructor(params: IShiftTabletReportSearchModel) {
    this.id = params.id || 0;
    this.pageNo = params.pageNo || 0;
    this.pageSize = params.pageSize || 10;
    this.orderKey = params.orderKey || "id";
    this.desc = params.desc || true;

    this.shiftTabletId = params.shiftTabletId || 0;
    this.roleTypeId = params.roleTypeId || 0;
    this.isDeleted = params.isDeleted || false;
  }
}

interface IShiftTabletReportViewModel {
  id?: number;

  shiftTabletId?: number;
  roleTypeId?: number;
  reportDescription?: string;
}
export class ShiftTabletReportViewModel implements IShiftTabletReportViewModel {
  id: number;

  shiftTabletId: number;
  roleTypeId: number;
  reportDescription: string;

  constructor(params: IShiftTabletReportViewModel) {
    this.id = params.id || 0;

    this.shiftTabletId = params.shiftTabletId || 0;
    this.roleTypeId = params.roleTypeId || 0;
    this.reportDescription = params.reportDescription || "";
  }
}
