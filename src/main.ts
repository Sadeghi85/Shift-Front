import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import i18n from "./i18n";

import { createPinia } from "pinia";

import useTokenStore from "./stores/token";
import { AppSettings } from "@/config";

import PrimeVue from "primevue/config";

import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";

//import "primevue/resources/themes/bootstrap4-light-blue/theme.css";
//import "primevue/resources/themes/lara-light-blue/theme.css";
import "@/assets/css/lara-light-blue-rtl.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

import "primeflex/primeflex.css";

import "@/assets/css/app.css";

import VuePersianDatetimePicker from "vue-persian-datetime-picker";

const pinia = createPinia();

const tokenStore = useTokenStore(pinia);
tokenStore.removeToken();

fetch(AppSettings.SSO_URL, {
  method: "post",
  headers: new Headers({
    "Content-Type": "application/json; charset=utf-8",
  }),
  body: JSON.stringify({ refresh_token: null }),
})
  .then((response) => response.json())
  .then((data) => {
    tokenStore.setToken(data);

    const app = createApp(App);

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

    app.component("PersianDatePicker", VuePersianDatetimePicker);

    app.mount("#app");
  })
  .catch(function (err) {
    console.log(err);
  });
