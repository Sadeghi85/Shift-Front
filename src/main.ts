import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import i18n from "./i18n";

import { createPinia } from "pinia";

import PrimeVue from "primevue/config";

import ToastService from "primevue/toastservice";

import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
/* eslint-disable */
import Button from "primevue/button";
/* eslint-disable */
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup"; //optional for column grouping
import Row from "primevue/row"; //optional for row
import Paginator from "primevue/paginator"; //optional for row grouping
import Toolbar from "primevue/toolbar";

//import "primevue/resources/themes/bootstrap4-light-blue/theme.css";
//import "primevue/resources/themes/lara-light-blue/theme.css";
import "@/assets/css/lara-light-blue-rtl.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

import "primeflex/primeflex.css";

import "@/assets/css/app.css";

const app = createApp(App);
const pinia = createPinia();

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

app.component("InputText", InputText);
app.component("Dropdown", Dropdown);
app.component("Button", Button);
app.component("Dialog", Dialog);
app.component("Toast", Toast);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("ColumnGroup", ColumnGroup);
app.component("Row", Row);
app.component("Paginator", Paginator);
app.component("Toolbar", Toolbar);

app.mount("#app");
