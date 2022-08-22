import { useI18n } from "vue-i18n";

interface IPaymentInputModel {
  id?: number;
  finalPayment?: number | null;
}
export class PaymentInputModel implements IPaymentInputModel {
  id: number;
  finalPayment: number | null;

  constructor(params: IPaymentInputModel) {
    this.id = params.id || 0;
    this.finalPayment = params.finalPayment || null;
  }
}

interface IPaymentSearchModel {
  id?: number;
  agentId?: number;
  portalId?: number;
  datePersian?: string;
  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
  desc?: boolean;
  isDeleted?: boolean | null;
}
export class PaymentSearchModel implements IPaymentSearchModel {
  id: number;
  agentId: number;
  portalId: number;
  datePersian: string;

  pageNo: number;
  pageSize: number;
  orderKey: string;
  desc: boolean;
  isDeleted: boolean | null;

  constructor(params: IPaymentSearchModel) {
    this.id = params.id || 0;
    this.agentId = params.agentId || 0;
    this.portalId = params.portalId || 0;
    this.datePersian = params.datePersian || "";

    this.pageNo = params.pageNo || 0;
    this.pageSize = params.pageSize || 2147483647; // Int32.MaxValue
    this.orderKey = params.orderKey || "id";
    this.desc = params.desc || true;
    this.isDeleted = params.isDeleted || false;
  }
}

interface IPaymentViewModel {
  id?: number;
  agentId?: number;
  portalId?: number;
  mandatoryShiftCount?: string;
  nonMandatoryShiftCount?: number;
  calculatedPayment?: number;
  finalPayment?: string;

  portalTitle?: string;
  firstName?: string;
  lastName?: string;
  agentFullName?: string;
}
export class PaymentViewModel implements IPaymentViewModel {
  id: number;
  agentId: number;
  portalId: number;
  mandatoryShiftCount: string;
  nonMandatoryShiftCount: number;
  calculatedPayment: number;
  finalPayment: string;

  portalTitle: string;
  firstName: string;
  lastName: string;
  agentFullName: string;

  constructor(params: IPaymentViewModel) {
    const { t } = useI18n();

    this.id = params.id || 0;
    this.agentId = params.agentId || 0;
    this.portalId = params.portalId || 0;

    this.mandatoryShiftCount =
      params.mandatoryShiftCount || t("general.undefined");
    this.nonMandatoryShiftCount = params.nonMandatoryShiftCount || 0;
    this.calculatedPayment = params.calculatedPayment || 0;
    this.finalPayment = params.finalPayment || "";

    this.portalTitle = params.portalTitle || "";
    this.firstName = params.firstName || "";
    this.lastName = params.lastName || "";
    this.agentFullName = params.agentFullName || "";
  }
}
