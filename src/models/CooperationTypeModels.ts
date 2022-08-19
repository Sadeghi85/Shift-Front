interface ICooperationTypeViewModel {
  id?: number;
  title?: string;
}
export class CooperationTypeViewModel implements ICooperationTypeViewModel {
  id: number;
  title: string;

  constructor(params: ICooperationTypeViewModel) {
    this.id = params.id || 0;
    this.title = params.title || "";
  }
}

interface ICooperationTypeSearchModel {
  id?: number;
  title?: string;

  desc?: boolean;
  pageNo?: number;
  pageSize?: number;
  orderKey?: string;
}
export class CooperationTypeSearchModel implements ICooperationTypeSearchModel {
  id: number;
  title: string;

  desc: boolean;
  pageNo: number;
  pageSize: number;
  orderKey: string;

  constructor(params: ICooperationTypeSearchModel) {
    this.id = params.id || 0;
    this.title = params.title || "";

    this.desc = params.desc || false;
    this.pageNo = params.pageNo || 0;
    this.pageSize = params.pageSize || 2147483647; // Int32.MaxValue
    this.orderKey = params.orderKey || "id";
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
