import {
  createRouter,
  //createWebHashHistory,
  createWebHistory,
  RouteRecordRaw,
} from "vue-router";
//import HomeView from "../views/HomeView.vue";

const routes: Array<RouteRecordRaw> = [
  /* {
    path: "/",
    name: "home",
    component: HomeView,
  }, */
  {
    path: "/locations",
    name: "locations",
    component: () =>
      import(
        /* webpackChunkName: "locations" */ "../views/location/LocationRD.vue"
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
    path: "/shift-tablet-crew-secretary/:shiftTabletId",
    name: "shift-tablet-crew-secretary",
    component: () =>
      import(
        /* webpackChunkName: "shift-tablet-crew-secretary" */ "../views/shift-tablet-crew/ShiftTabletCrewSecretary.vue"
      ),
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
