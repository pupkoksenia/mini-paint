import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useFireBase } from "../composables/useFireBase";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomeView.vue"),
    meta: { auth: true },
    children: [
      {
        path: "/gallery",
        component: () => import("../components/GalleryPage.vue"),
        meta: { auth: true },
      },
      {
        path: "/create-paint",
        component: () => import("../components/CreatePaintPage.vue"),
        meta: { auth: true },
      },
      {
        path: "/set-roles",
        component: () => import("../components/RolesPage.vue"),
        meta: { auth: true, role: ["admin"] },
      },
    ],
  },

  {
    path: "/loader",
    component: () => import("../components/LoaderPage.vue"),
  },
  {
    path: "/authentification",
    children: [
      {
        path: "/register",
        component: () => import("../components/RegisterFormPage.vue"),
      },
      {
        path: "/sign-in",
        component: () => import("../components/SignInFormPage.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("../components/NotFoundPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requireAuth = to.matched.some((record) => record.meta.auth);
  const requireRole = to.matched.some((record) => record.meta.role);
  const { state } = useFireBase();

  if (requireAuth && state.user.email === "") next({ path: "/sign-in" });
  if (requireRole && state.user.role === "user") next({ path: "/gallery" });
  else next();
});

export default router;
