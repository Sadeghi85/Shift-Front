import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import PrimeVue from "primevue/config";

import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";
import Dialog from "primevue/dialog";

import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

import "primeflex/primeflex.css";

const app = createApp(App);

app.use(router);

app.use(PrimeVue);

app.component("InputText", InputText);
app.component("Dropdown", Dropdown);
app.component("Button", Button);
app.component("Dialog", Dialog);

app.mount("#app");
