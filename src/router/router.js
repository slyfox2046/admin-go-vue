/**
 * 路由封装
 */

import storage from '@/utils/storage'
import Home from '@/views/Home'
import Login from '@/views/Login'
import Welcome from '@/views/Welcome'
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

// 路由集合
const router = new Router({
  // 去掉url上的#号
  mode: 'history',
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome,
        },
      ],
    },
  ],
})

// 挂载路由导航
router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    return next()
  }
  const tokenStr = storage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  }
  next()
})

export default router
