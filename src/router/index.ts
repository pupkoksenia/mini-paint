import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { useFireBase } from "../composables/useFireBase";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("../App.vue"),
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("../views/HomeView.vue"),
        children: [],
      },
      {
        path: "/authentication",
        component: () => import("../views/AuthenticationView.vue"),
        children: [
          {
            path: "/register",
            name: "register",
            component: () => import("../components/RegisterForm.vue"),
          },
          {
            path: "/sign-in",
            name: "sign-in",
            component: () => import("../components/SignInForm.vue"),
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const { state } = useFireBase();

  if (
    to.path === "/" &&
    state.user.email === "" &&
    from.path !== "/authentication"
  )
    next({ path: "/authentication" });
  else if (to.path === "/" && state.user.email !== "" && from.path !== "/home")
    next({ path: "/home" });
  else next();
});

export default router;
