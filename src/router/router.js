/**
 * 路由封装
 */

import Home from "@/views/Home";
import Login from "@/views/Login";
import Welcome from "@/views/Welcome";
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

// 路由集合
const router = new Router({
  // 去掉url上的#号
  mode: "history",
  routers: [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    {
      path: "/home",
      component: Home,
      redirect: "/welcome",
      children: [
        {
          path: "/welcome",
          component: Welcome,
        },
      ],
    },
  ],
});

export default router;
