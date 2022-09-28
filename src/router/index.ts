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
    path: "/payment",
    name: "payment",
    component: () =>
      import(/* webpackChunkName: "payment" */ "../views/payment/Payment.vue"),
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
  {
    path: "/pakhsh-overseer-report/:shiftTabletId",
    component: () =>
      import(
        /* webpackChunkName: "shift-tablet-pakhsh-overseer-report" */ "../views/shift-tablet-pakhsh-overseer-report/PakhshOverseerSteps.vue"
      ),
    children: [
      {
        path: "",
        name: "shift-tablet-pakhsh-overseer-report",
        component: () =>
          import(
            /* webpackChunkName: "pakhsh-overseer-crew" */ "../views/shift-tablet-pakhsh-overseer-report/PakhshOverseerCrew.vue"
          ),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/pakhsh-overseer-report-description/:shiftTabletId",
        name: "shift-tablet-pakhsh-overseer-report-description",
        component: () =>
          import(
            /* webpackChunkName: "pakhsh-overseer-report-description" */ "../views/shift-tablet-pakhsh-overseer-report/PakhshOverseerReportDescription.vue"
          ),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/pakhsh-overseer-conductor-changes/:shiftTabletId",
        name: "shift-tablet-pakhsh-overseer-conductor-changes",
        component: () =>
          import(
            /* webpackChunkName: "pakhsh-overseer-conductor-changes" */ "../views/shift-tablet-pakhsh-overseer-report/PakhshOverseerConductorChanges.vue"
          ),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/pakhsh-overseer-review-problems/:shiftTabletId",
        name: "shift-tablet-pakhsh-overseer-review-problems",
        component: () =>
          import(
            /* webpackChunkName: "pakhsh-overseer-review-problems" */ "../views/shift-tablet-pakhsh-overseer-report/PakhshOverseerReviewProblems.vue"
          ),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: "/portal-settings",
    component: () =>
      import(
        /* webpackChunkName: "portal-settings" */ "../views/portal-settings/SettingTabMenu.vue"
      ),
    children: [
      {
        path: "",
        name: "portal-settings",
        component: () =>
          import(
            /* webpackChunkName: "portal-settings-locations" */ "../views/location/PortalLocationRD.vue"
          ),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/portal-settings-mandatory-shift-count",
        name: "portal-settings-mandatory-shift-count",
        component: () =>
          import(
            /* webpackChunkName: "portal-settings-mandatory-shift-count" */ "../views/portal-settings/MandatoryShiftCount.vue"
          ),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/portal-settings-non-mandatory-shift-wage",
        name: "portal-settings-non-mandatory-shift-wage",
        component: () =>
          import(
            /* webpackChunkName: "portal-settings-non-mandatory-shift-wage" */ "../views/portal-settings/NonMandatoryShiftWage.vue"
          ),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/portal-settings-month-start-day",
        name: "portal-settings-month-start-day",
        component: () =>
          import(
            /* webpackChunkName: "portal-settings-month-start-day" */ "../views/portal-settings/MonthStartDay.vue"
          ),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: "/reports",
    component: () =>
      import(/* webpackChunkName: "reports" */ "../views/reports/Reports.vue"),
    children: [
      {
        path: "",
        name: "reports",
        component: () =>
          import(
            /* webpackChunkName: "shift-tablet-reports" */ "../views/reports/ShiftTabletReport.vue"
          ),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/shift-tablet-full-calendar",
        name: "shift-tablet-full-calendar",
        component: () =>
          import(
            /* webpackChunkName: "shift-tablet-full-calendar" */ "../views/reports/ShiftTabletFullCalendar.vue"
          ),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "/shift-tablet-crew-full-calendar",
        name: "shift-tablet-crew-full-calendar",
        component: () =>
          import(
            /* webpackChunkName: "shift-tablet-crew-full-calendar" */ "../views/reports/ShiftTabletCrewFullCalendar.vue"
          ),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  // {
  //   path: "/shift-tablet-full-calendar",
  //   name: "shift-tablet-full-calendar",
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "shift-tablet-full-calendar" */ "../views/reports/ShiftTabletFullCalendar.vue"
  //     ),
  //   meta: {
  //     requiresAuth: true,
  //   },
  // },
  // {
  //   path: "/shift-tablet-crew-full-calendar",
  //   name: "shift-tablet-crew-full-calendar",
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "shift-tablet-crew-full-calendar" */ "../views/reports/ShiftTabletCrewFullCalendar.vue"
  //     ),
  //   meta: {
  //     requiresAuth: true,
  //   },
  // },
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
