export interface TokenViewModel {
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
  scope: string;
}

export interface TokenInputModel {
  refresh_token: string;
}
