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
    meta: {
      requiresAuth: true,
    },
    // beforeEnter: (to, from) => {
    //   if (ability.cannot("locations.full", "all")) {
    //     return false;
    //   }
    // },
  },
  {
    path: "/portal-locations",
    name: "portal-locations",
    component: () =>
      import(
        /* webpackChunkName: "portal-locations" */ "../views/location/PortalLocationRD.vue"
      ),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/shift-definition",
    name: "shift-definition",
    component: () =>
      import(
        /* webpackChunkName: "shift-definition" */ "../views/shift-definition/ShiftDefinitionRD.vue"
      ),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/shift-tablet",
    name: "shift-tablet",
    component: () =>
      import(
        /* webpackChunkName: "shift-tablet" */ "../views/shift-tablet/ShiftTabletRD.vue"
      ),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/shift-tablet-crew/:shiftTabletId",
    name: "shift-tablet-crew",
    component: () =>
      import(
        /* webpackChunkName: "shift-tablet-crew" */ "../views/shift-tablet-coordinator/ShiftTabletCrewRD.vue"
      ),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/secretary-report/:shiftTabletId",
    component: () =>
      import(
        /* webpackChunkName: "shift-tablet-secretary-report" */ "../views/shift-tablet-secretary-report/SecretarySteps.vue"
      ),
    children: [
      {
        path: "",
        name: "shift-tablet-secretary-report",
        component: () =>
          import(
            /* webpackChunkName: "secretary-crew" */ "../views/shift-tablet-secretary-report/SecretaryCrew.vue"
          ),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/secretary-report-description/:shiftTabletId",
        name: "shift-tablet-secretary-report-description",
        component: () =>
          import(
            /* webpackChunkName: "secretary-report-description" */ "../views/shift-tablet-secretary-report/SecretaryReportDescription.vue"
          ),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/secretary-conductor-changes/:shiftTabletId",
        name: "shift-tablet-secretary-conductor-changes",
        component: () =>
          import(
            /* webpackChunkName: "secretary-conductor-changes" */ "../views/shift-tablet-secretary-report/SecretaryConductorChanges.vue"
          ),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/secretary-review-problems/:shiftTabletId",
        name: "shift-tablet-secretary-review-problems",
        component: () =>
          import(
            /* webpackChunkName: "secretary-review-problems" */ "../views/shift-tablet-secretary-report/SecretaryReviewProblems.vue"
          ),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_BASE_ROUTE_URL),
  //history: createWebHashHistory(),
  routes,
});

router.beforeEach((to) => {
  // ✅ This will work because the router starts its navigation after
  // the router is installed and pinia will be installed too
  //const store = useStore();

  //if (to.meta.requiresAuth && !store.isLoggedIn) return "/login";
  if (to.meta.requiresAuth && ability.cannot(to.name, "all")) {
    return router.push({ name: "home" });
  }
});

export default router;
