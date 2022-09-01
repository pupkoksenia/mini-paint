import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useFireBase } from "../composables/useFireBase";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomeView.vue"),
    meta: { auth: true },
  },
  {
    path: "/loader",
    component: () => import("../views/LoaderPage.vue"),
  },
  {
    path: "/authentification",
    children:[
      {
        path: "/register",
        component: () => import("../views/RegisterFormPage.vue"),
      },
      {
        path: "/sign-in",
        component: () => import("../views/SignInFormPage.vue"),
      },
    ]
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("../views/NotFoundPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requireAuth = to.matched.some((record) => record.meta.auth);
  const { state } = useFireBase()
  console.log(from.path, to.path)
  //if(to.path === "/" && from.path==="/") next({path:"/loader"})

  if(requireAuth && state.user.email === "") next({path: "/sign-in"})
  else next();
})

export default router;
