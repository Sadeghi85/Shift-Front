interface IShiftDefinitionInputModel {
  id?: number;
  title?: string;
  portalId?: number;
  shiftType?: number;
  startTime?: string;
  endTime?: string;
}
export class ShiftDefinitionInputModel implements IShiftDefinitionInputModel {
  id: number;
  title: string;
  portalId: number;
  shiftType: number;
  startTime: string;
  endTime: string;

  constructor(params: IShiftDefinitionInputModel) {
    this.id = params.id || 0;
    this.title = params.title || "";
    this.portalId = params.portalId || 0;
    this.shiftType = params.shiftType || 0;
    this.startTime = params.startTime || "";
    this.endTime = params.endTime || "";
  }
}

interface IShiftDefinitionSearchModel {
  id?: number;
  portalId?: number;
  shiftType?: number;
  title?: string;
  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
  desc?: boolean;
  isDeleted?: boolean | null;
}
export class ShiftDefinitionSearchModel implements IShiftDefinitionSearchModel {
  id: number;
  portalId: number;
  shiftType: number;
  title: string;
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;
  isDeleted: boolean | null;

  constructor(params: IShiftDefinitionSearchModel) {
    this.id = params.id || 0;
    this.portalId = params.portalId || 0;
    this.shiftType = params.shiftType || 0;
    this.title = params.title || "";
    this.pageNo = params.pageNo || 0;
    this.pageSize = params.pageSize || 2147483647; // Int32.MaxValue
    this.orderKey = params.orderKey || "id";
    this.desc = params.desc || true;
    this.isDeleted = params.isDeleted || false;
  }
}

interface IShiftDefinitionViewModel {
  id?: number;
  title?: string;
  portalId?: number;
  portalTitle?: string;
  startTime?: string;
  endTime?: string;
  shiftTypeTitle?: string;
}
export class ShiftDefinitionViewModel implements IShiftDefinitionViewModel {
  id: number;
  title: string;
  portalId: number;
  portalTitle: string;
  startTime: string;
  endTime: string;
  shiftTypeTitle: string;

  constructor(params: IShiftDefinitionViewModel) {
    this.id = params.id || 0;
    this.title = params.title || "";
    this.portalId = params.portalId || 0;
    this.portalTitle = params.portalTitle || "";
    this.startTime = params.startTime || "";
    this.endTime = params.endTime || "";
    this.shiftTypeTitle = params.shiftTypeTitle || "";
  }
}
