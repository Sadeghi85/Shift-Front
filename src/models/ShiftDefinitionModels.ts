interface IShiftDefinitionInputModel {
  id?: number;
  title?: string;
  portalId?: number;
  shiftTypeId?: number;
  startTime?: string;
  endTime?: string;
}
export class ShiftDefinitionInputModel implements IShiftDefinitionInputModel {
  id: number;
  title: string;
  portalId: number;
  shiftTypeId: number;
  startTime: string;
  endTime: string;

  constructor(params: IShiftDefinitionInputModel) {
    this.id = params.id || 0;
    this.title = params.title || "";
    this.portalId = params.portalId || 0;
    this.shiftTypeId = params.shiftTypeId || 0;
    this.startTime = params.startTime || "00:00:00";
    this.endTime = params.endTime || "00:00:00";
  }
}

interface IShiftDefinitionSearchModel {
  id?: number;
  portalId?: number;
  shiftTypeId?: number;
  title?: string;
  startTime?: string | null;
  endTime?: string | null;
  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
  desc?: boolean;
  isDeleted?: boolean | null;
}
export class ShiftDefinitionSearchModel implements IShiftDefinitionSearchModel {
  id: number;
  portalId: number;
  shiftTypeId: number;
  title: string;
  startTime: string | null;
  endTime: string | null;
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;
  isDeleted: boolean | null;

  constructor(params: IShiftDefinitionSearchModel) {
    this.id = params.id || 0;
    this.portalId = params.portalId || 0;
    this.shiftTypeId = params.shiftTypeId || 0;
    this.title = params.title || "";
    this.startTime = params.startTime || null;
    this.endTime = params.endTime || null;
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
  shiftTypeId?: number;
  shiftTypeTitle?: string;
  displayLabel?: string;
}
export class ShiftDefinitionViewModel implements IShiftDefinitionViewModel {
  id: number;
  title: string;
  portalId: number;
  portalTitle: string;
  startTime: string;
  endTime: string;
  shiftTypeId: number;
  shiftTypeTitle: string;
  displayLabel: string;

  constructor(params: IShiftDefinitionViewModel) {
    this.id = params.id || 0;
    this.title = params.title || "";
    this.portalId = params.portalId || 0;
    this.portalTitle = params.portalTitle || "";
    this.startTime = params.startTime || "";
    this.endTime = params.endTime || "";
    this.shiftTypeId = params.shiftTypeId || 0;
    this.shiftTypeTitle = params.shiftTypeTitle || "";
    this.displayLabel = params.displayLabel || "";
  }
}
