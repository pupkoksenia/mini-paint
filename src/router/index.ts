import { ref } from "vue";
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { useFireBase } from "../composables/useFireBase";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/register",
    component: () => import("../components/RegisterForm.vue"),
  },
  {
    path: "/sign-in",
    component: () => import("../components/SignInForm.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const { checkIsRegistred, state } = useFireBase();

  checkIsRegistred().then((val)=>{
   if (from.path === "/" && to.path === "/sign-in") next({ path: "/" });
   if (from.path === "/" && to.path === "/register") next({ path: "/" });
   else next()
  }).catch((val)=>{
    if (to.path === "/" && state.user.email === "" && from.path !== "/sign-in") next({ path: "/sign-in" });
    else next()
  })
});

export default router;
