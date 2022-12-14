interface IShiftTabletFullReportInputModel {
  portalId?: number;
  shiftTypeId?: number;
  datePersian?: string;
}
export class ShiftTabletFullReportInputModel
  implements IShiftTabletFullReportInputModel
{
  portalId: number;
  shiftTypeId: number;
  datePersian: string;

  constructor(params: IShiftTabletFullReportInputModel) {
    this.portalId = params.portalId || 0;
    this.shiftTypeId = params.shiftTypeId || 0;
    this.datePersian = params.datePersian || "";
  }
}

interface IShiftTabletFullReportViewModel {
  id?: number;
  portalId?: number;

  fromDate?: string;
  toDate?: string;

  month?: string;

  shiftTabletTotalCount?: number;
  shiftTabletRegisteredCount?: number;
  shiftTabletUnRegisteredCount?: number;
  shiftTabletRegisteredCrewCount?: number;
}

export class ShiftTabletFullReportViewModel
  implements IShiftTabletFullReportViewModel
{
  id: number;
  portalId: number;

  fromDate: string;
  toDate: string;

  month: string;

  shiftTabletTotalCount: number;
  shiftTabletRegisteredCount: number;
  shiftTabletUnRegisteredCount: number;
  shiftTabletRegisteredCrewCount: number;

  constructor(params: IShiftTabletFullReportViewModel) {
    this.id = params.id || 0;
    this.portalId = params.portalId || 0;

    this.fromDate = params.fromDate || "";
    this.toDate = params.toDate || "";

    this.month = params.month || "";

    this.shiftTabletTotalCount = params.shiftTabletTotalCount || 0;
    this.shiftTabletRegisteredCount = params.shiftTabletRegisteredCount || 0;
    this.shiftTabletUnRegisteredCount =
      params.shiftTabletUnRegisteredCount || 0;
    this.shiftTabletRegisteredCrewCount =
      params.shiftTabletRegisteredCrewCount || 0;
  }
}

interface IShiftTabletFullCalendarInputModel {
  portalId?: number;
  shiftTypeId?: number;
  datePersian?: string;
}
export class ShiftTabletFullCalendarInputModel
  implements IShiftTabletFullCalendarInputModel
{
  portalId: number;
  shiftTypeId: number;
  datePersian: string;

  constructor(params: IShiftTabletFullCalendarInputModel) {
    this.portalId = params.portalId || 0;
    this.shiftTypeId = params.shiftTypeId || 0;
    this.datePersian = params.datePersian || "";
  }
}

interface IShiftTabletFullCalendarViewModel {
  id?: number;
  title?: string;
  portalId?: number;
  shiftId?: number;
  shiftTypeId?: number;
  shiftTabletId?: number;
  portalTitle?: string;
  shiftDate?: string;
  templateCount?: number;
  crewCount?: number;
}

export class ShiftTabletFullCalendarViewModel
  implements IShiftTabletFullCalendarViewModel
{
  id: number;
  title: string;
  portalId: number;
  shiftId: number;
  shiftTypeId: number;
  shiftTabletId: number;
  portalTitle: string;
  shiftDate: string;
  templateCount: number;
  crewCount: number;

  constructor(params: IShiftTabletFullCalendarViewModel) {
    this.id = params.id || 0;
    this.title = params.title || "";

    this.portalId = params.portalId || 0;
    this.shiftId = params.shiftId || 0;
    this.shiftTypeId = params.shiftTypeId || 0;
    this.shiftTabletId = params.shiftTabletId || 0;

    this.portalTitle = params.portalTitle || "";
    this.shiftDate = params.shiftDate || "";

    this.templateCount = params.templateCount || 0;
    this.crewCount = params.crewCount || 0;
  }
}

interface IShiftTabletCrewFullCalendarInputModel {
  agentId?: number;
  portalId?: number;
  shiftTypeId?: number;
  datePersian?: string;
}
export class ShiftTabletCrewFullCalendarInputModel
  implements IShiftTabletCrewFullCalendarInputModel
{
  agentId: number;
  portalId: number;
  shiftTypeId: number;
  datePersian: string;

  constructor(params: IShiftTabletCrewFullCalendarInputModel) {
    this.agentId = params.agentId || 0;
    this.portalId = params.portalId || 0;
    this.shiftTypeId = params.shiftTypeId || 0;
    this.datePersian = params.datePersian || "";
  }
}

interface IShiftTabletCrewFullCalendarViewModel {
  id?: number;
  title?: string;
  portalId?: number;
  shiftId?: number;
  shiftTabletId?: number;
  shiftTabletCrewId?: number;
  agentId?: number;
  portalTitle?: string;
  shiftDate?: string;
}

export class ShiftTabletCrewFullCalendarViewModel
  implements IShiftTabletCrewFullCalendarViewModel
{
  id: number;
  title: string;
  portalId: number;
  shiftId: number;
  shiftTabletId: number;
  shiftTabletCrewId: number;
  agentId: number;
  portalTitle: string;
  shiftDate: string;

  constructor(params: IShiftTabletCrewFullCalendarViewModel) {
    this.id = params.id || 0;
    this.title = params.title || "";

    this.portalId = params.portalId || 0;
    this.shiftId = params.shiftId || 0;
    this.shiftTabletId = params.shiftTabletId || 0;
    this.shiftTabletCrewId = params.shiftTabletCrewId || 0;
    this.agentId = params.agentId || 0;

    this.portalTitle = params.portalTitle || "";
    this.shiftDate = params.shiftDate || "";
  }
}
