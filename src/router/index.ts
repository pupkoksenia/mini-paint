import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useFireBase } from "../composables/useFireBase";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("../views/HomeView.vue"),
    meta: { auth: true },
  },
  {
    path: "/register",
    component: () => import("../components/RegisterForm.vue"),
    meta: { auth: false },
  },
  {
    path: "/sign-in",
    component: () => import("../components/SignInForm.vue"),
    meta: { auth: false },
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("../components/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const { checkIsRegistred } = useFireBase();
  const requireAuth = to.matched.some((record) => record.meta.auth);
  checkIsRegistred()
    .then(() => {
      if (!requireAuth) next({ path: "/" });
      next();
    })
    .catch(() => {
      if (requireAuth) next({ path: "/sign-in" });
      else next();
    });
});

export default router;
