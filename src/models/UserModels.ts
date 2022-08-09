import { ITokenViewModel } from "./TokenModels";

export interface IUserViewModel {
  firstName: string | null;
  lastName: string | null;
  userName: string | null;
  fullName: string | null;
  portalId: number | null;
  userId: number | null;
  token: ITokenViewModel | null;
  permissions: [string] | null;
}
