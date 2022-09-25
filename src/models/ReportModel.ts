interface IShiftTabletFullCalendarInputModel {
  portalId?: number;
  datePersian?: string;
}
export class ShiftTabletFullCalendarInputModel
  implements IShiftTabletFullCalendarInputModel
{
  portalId: number;
  datePersian: string;

  constructor(params: IShiftTabletFullCalendarInputModel) {
    this.portalId = params.portalId || 0;
    this.datePersian = params.datePersian || "";
  }
}

interface IShiftTabletFullCalendarViewModel {
  id?: number;
  title?: string;
  portalId?: number;
  shiftId?: number;
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
    this.shiftTabletId = params.shiftTabletId || 0;

    this.portalTitle = params.portalTitle || "";
    this.shiftDate = params.shiftDate || "";

    this.templateCount = params.templateCount || 0;
    this.crewCount = params.crewCount || 0;
  }
}

// interface ContactDTO {
//   uuid: string;
//   firstName: string;
//   middleName: string;
//   lastName: string;
//   phoneNumber: string;
//   emailAddress: string;
//   homeAddress: string;
// }
// export class Contact implements ContactDTO {
//   uuid: string;
//   firstName: string;
//   middleName: string;
//   lastName: string;
//   phoneNumber: string;
//   emailAddress: string;
//   homeAddress: string;

//   constructor(params: ContactDTO) {
//       this.uuid = params.uuid
//       this.firstName = params.firstName
//       this.middleName = params.middleName
//       this.lastName = params.lastName
//       this.phoneNumber = params.phoneNumber
//       this.emailAddress = params.emailAddress
//       this.homeAddress = params.homeAddress
//   }

//   toJSON() {
//       return {
//           uuid: this.uuid,
//           firstName: this.firstName,
//           middleName: this.middleName,
//           lastName: this.lastName,
//           phoneNumber: this.phoneNumber,
//           emailAddress: this.emailAddress,
//           homeAddress: this.homeAddress
//       }
//   }
// }
