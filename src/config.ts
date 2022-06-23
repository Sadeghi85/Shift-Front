const ssoUrl =
  process.env.VUE_APP_BASE_SSO_URL + process.env.VUE_APP_BASE_SSO_FLD;
const apiUrl =
  process.env.VUE_APP_BASE_API_URL + process.env.VUE_APP_BASE_API_FLD;

export const AppSettings = {
  /* LOGIN: preUrlSSO + "/connect/token",
    GET_CATALOG: preUrl + "/api/v1/Catalog/GetCatalog", */
  API_URL: apiUrl,
  SSO_URL: ssoUrl,
};
