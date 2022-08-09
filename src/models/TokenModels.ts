export interface ITokenViewModel {
  access_token: string | null;
  expires_in: number | null;
  token_type: string | null;
  refresh_token: string | null;
  scope: string | null;
}

export interface ITokenInputModel {
  refresh_token: string | null;
}
