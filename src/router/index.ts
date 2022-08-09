import {
  createRouter,
  //createWebHashHistory,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";
//import HomeView from "../views/HomeView.vue";
import ability from "@/casl/ability";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
  },
  {
    path: "/locations",
    name: "locations",
    component: () =>
      import(
        /* webpackChunkName: "locations" */ "../views/location/LocationRD.vue"
      ),
    beforeEnter: (to, from) => {
      if (ability.cannot("locations.full", "all")) {
        return false;
      }
    },
  },
  {
    path: "/portal-locations",
    name: "portal-locations",
    component: () =>
      import(
        /* webpackChunkName: "portal-locations" */ "../views/location/PortalLocationRD.vue"
      ),
  },
  {
    path: "/shift-definition",
    name: "shift-definition",
    component: () =>
      import(
        /* webpackChunkName: "shift-definition" */ "../views/shift-definition/ShiftDefinitionRD.vue"
      ),
  },
  {
    path: "/shift-tablet",
    name: "shift-tablet",
    component: () =>
      import(
        /* webpackChunkName: "shift-tablet" */ "../views/shift-tablet/ShiftTabletRD.vue"
      ),
  },
  {
    path: "/shift-tablet-crew/:shiftTabletId",
    name: "shift-tablet-crew",
    component: () =>
      import(
        /* webpackChunkName: "shift-tablet-crew" */ "../views/shift-tablet-crew/ShiftTabletCrewRD.vue"
      ),
  },
  {
    path: "/shift-tablet-secretary-report/:shiftTabletId",
    component: () =>
      import(
        /* webpackChunkName: "shift-tablet-secretary-report" */ "../views/shift-tablet-crew/secretary-report/SecretarySteps.vue"
      ),
    children: [
      {
        path: "",
        name: "shift-tablet-secretary-report",
        component: () =>
          import(
            /* webpackChunkName: "shift-tablet-secretary-report-crew" */ "../views/shift-tablet-crew/secretary-report/ShiftTabletCrewSecretary.vue"
          ),
      },
      {
        path: "/shift-tablet-secretary-report-description/:shiftTabletId",
        name: "shift-tablet-secretary-report-description",
        component: () =>
          import(
            /* webpackChunkName: "shift-tablet-secretary-report-description" */ "../views/shift-tablet-crew/secretary-report/SecretaryReportDescription.vue"
          ),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_BASE_ROUTE_URL),
  //history: createWebHashHistory(),
  routes,
});

/* router.beforeEach((to) => {
  // ✅ This will work because the router starts its navigation after
  // the router is installed and pinia will be installed too
  const store = useStore();

  if (to.meta.requiresAuth && !store.isLoggedIn) return "/login";
}); */

export default router;
