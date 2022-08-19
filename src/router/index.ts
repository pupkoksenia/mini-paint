import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { useFireBase } from "../composables/useFireBase";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("../views/HomeView.vue"),
    //meta: {state: }
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
  const { state } = useFireBase();
  console.log(to.path, from.path, localStorage.getItem("email"));
  if (to.path === "/" && state.user.email === "" && from.path !== "/sign-in") next({ path: "/sign-in" });
  else if (to.path === "/sign-in" &&  state.user.email !== "" ) next({ path: "/" });
  else next();
  /*if (
    to.path === "/" &&
    localStorage.getItem("email") === "" &&
    from.path !== "/sign-in"
  )
   
  /*if (to.path === "/sign-in" && localStorage.getItem("email") !== "" )
    next({ path: "/" });
  if (to.path === "/register" && localStorage.getItem("email") !== "" )
    next({ path: "/" });*/
  
  
});

export default router;
