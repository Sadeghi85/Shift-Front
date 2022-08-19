interface IMonetarySettingInputModel {
  id?: number;
  portalId?: number;
  cooperationTypeId?: number | null;
  jobId?: number | null;
  mandatoryShiftCount?: number | null;
  nonMandatoryShiftWage?: number | null;
}
export class MonetarySettingInputModel implements IMonetarySettingInputModel {
  id: number;
  portalId: number;
  cooperationTypeId: number | null;
  jobId: number | null;
  mandatoryShiftCount: number | null;
  nonMandatoryShiftWage: number | null;

  constructor(params: IMonetarySettingInputModel) {
    this.id = params.id || 0;
    this.portalId = params.portalId || 0;
    this.cooperationTypeId = params.cooperationTypeId || null;
    this.jobId = params.jobId || null;
    this.mandatoryShiftCount = params.mandatoryShiftCount || null;
    this.nonMandatoryShiftWage = params.nonMandatoryShiftWage || null;
  }
}

interface IMonetarySettingSearchModel {
  id?: number;
  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
  desc?: boolean;

  portalId?: number;
  cooperationTypeId?: number;
  jobId?: number;

  mandatoryField?: string;

  isDeleted?: boolean | null;
}
export class MonetarySettingSearchModel implements IMonetarySettingSearchModel {
  id: number;
  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;

  portalId: number;
  cooperationTypeId: number;
  jobId: number;

  mandatoryField: string;

  isDeleted: boolean | null;

  constructor(params: IMonetarySettingSearchModel) {
    this.id = params.id || 0;
    this.pageNo = params.pageNo || 0;
    this.pageSize = params.pageSize || 2147483647; // Int32.MaxValue
    this.orderKey = params.orderKey || "id";
    this.desc = params.desc || true;

    this.portalId = params.portalId || 0;
    this.cooperationTypeId = params.cooperationTypeId || 0;
    this.jobId = params.jobId || 0;

    this.mandatoryField = params.mandatoryField || "";

    this.isDeleted = params.isDeleted || false;
  }
}

interface IMonetarySettingViewModel {
  id?: number;

  portalId?: number;
  cooperationTypeId?: number | null;
  jobId?: number | null;
  mandatoryShiftCount?: number | null;
  nonMandatoryShiftWage?: number | null;

  portalTitle?: string;
  cooperationTypeTitle?: string;
  jobTitle?: string;
}
export class MonetarySettingViewModel implements IMonetarySettingViewModel {
  id: number;

  portalId: number;
  cooperationTypeId: number | null;
  jobId: number | null;
  mandatoryShiftCount: number | null;
  nonMandatoryShiftWage: number | null;

  portalTitle: string;
  cooperationTypeTitle: string;
  jobTitle: string;

  constructor(params: IMonetarySettingViewModel) {
    this.id = params.id || 0;

    this.portalId = params.portalId || 0;
    this.cooperationTypeId = params.cooperationTypeId || null;
    this.jobId = params.jobId || null;
    this.mandatoryShiftCount = params.mandatoryShiftCount || null;
    this.nonMandatoryShiftWage = params.nonMandatoryShiftWage || null;

    this.portalTitle = params.portalTitle || "";
    this.cooperationTypeTitle = params.cooperationTypeTitle || "";
    this.jobTitle = params.jobTitle || "";
  }
}
