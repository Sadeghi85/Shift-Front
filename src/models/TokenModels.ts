export interface ITokenViewModel {
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
  scope: string;
}

export interface ITokenInputModel {
  refresh_token: string;
}
