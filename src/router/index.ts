import {
  createRouter,
  createWebHashHistory,
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
    path: "/shift-location",
    name: "shift-location",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "shift-location" */ "../views/ShiftLocationView.vue"
      ),
  },
  {
    path: "/shift-production-type",
    name: "shift-production-type",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "shift-production-type" */ "../views/ShiftProductionTypeView.vue"
      ),
  },
  {
    path: "/shift-definition",
    name: "shift-definition",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "shift-definition" */ "../views/ShiftDefinitionView.vue"
      ),
  },
  {
    path: "/shift-tablet",
    name: "shift-tablet",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "shift-tablet" */ "../views/ShiftTabletView.vue"
      ),
  },
];

const router = createRouter({
  //history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(),
  routes,
});

/* router.beforeEach((to) => {
  // ✅ This will work because the router starts its navigation after
  // the router is installed and pinia will be installed too
  const store = useStore();

  if (to.meta.requiresAuth && !store.isLoggedIn) return "/login";
}); */

export default router;
