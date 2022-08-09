import { createApp } from "vue";

import { abilitiesPlugin } from "@casl/vue";
import ability from "./casl/ability";

import App from "./App.vue";
import Loading from "./Loading.vue";
import router from "./router";

import i18n from "./i18n";

import { createPinia } from "pinia";

import useTokenStore from "./stores/token";
import { AppSettings } from "./config";

import Vue3PersianDatetimePicker from "vue3-persian-datetime-picker";

import PrimeVue from "primevue/config";

import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";

import { ITokenViewModel } from "./models/TokenModels";

//import "primevue/resources/themes/bootstrap4-light-blue/theme.css";
//import "primevue/resources/themes/lara-light-blue/theme.css";
import "@/assets/css/lara-light-blue-rtl.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

import "primeflex/primeflex.min.css";

import "@/assets/css/app.css";

const pinia = createPinia();

const tokenStore = useTokenStore(pinia);
tokenStore.removeToken();

const loading = createApp(Loading);
loading.use(PrimeVue, {
  ripple: true,
  inputStyle: "filled",
  zIndex: {
    modal: 10100, //dialog, sidebar
    overlay: 10100, //dropdown, overlaypanel
    menu: 10100, //overlay menus
    tooltip: 10100, //tooltip
    toast: 10100, //toast
  },
});
loading.mount("#app");

const loadAndConfigApp = async (loading: any) => {
  if (loading) {
    loading.unmount();
  }

  const app = createApp(App);

  app.use(abilitiesPlugin, ability);

  app.use(router);
  app.use(i18n);
  app.use(pinia);
  app.use(PrimeVue, {
    ripple: true,
    inputStyle: "filled",
    zIndex: {
      modal: 10100, //dialog, sidebar
      overlay: 10100, //dropdown, overlaypanel
      menu: 10100, //overlay menus
      tooltip: 10100, //tooltip
      toast: 10100, //toast
    },
  });
  app.use(ToastService);
  app.use(ConfirmationService);

  app.use(Vue3PersianDatetimePicker, {
    name: "PersianDatePicker",
    props: {
      format: "YYYY-MM-DD HH:mm:ss",
      displayFormat: "jYYYY/jMM/jDD HH:mm:ss",
      editable: false,
      inputClass: "p-inputtext p-component",
      placeholder: "",
      color: "#3B82F6",
      type: "datetime",
      compactTime: true,
      clearable: true,
      autoSubmit: true,
      popover: true,
    },
  });

  const portalService = ref(new PortalService());
  await portalService.value.getAll(new PortalSearchModel({}));

  app.mount("#app");
};

fetch(AppSettings.SSO_URL, {
  method: "post",
  headers: new Headers({
    "Content-Type": "application/json; charset=utf-8",
  }),
  body: JSON.stringify({ refresh_token: null }),
})
  .then((response) => response.json())
  .then(async (data: ITokenViewModel) => {
    if (!data.access_token) {
      throw new Error("Token is null");
    }

    tokenStore.setToken(data);

    await loadAndConfigApp(loading);
  })
  .catch(function (err) {
    console.log(err);
  });
