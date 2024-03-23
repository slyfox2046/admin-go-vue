/**
 * 路由封装
 */

import storage from '@/utils/storage'
import Home from '@/views/Home'
import Login from '@/views/Login'
import Welcome from '@/views/Welcome'

import Personal from '@/views/Personal'
import Admin from '@/views/base/Admin'
import Role from '@/views/base/Role'
import Dept from '@/views/base/Dept'
import Menu from '@/views/base/Menu'
import Post from '@/views/base/Post'
import LoginLog from '@/views/monitor/LoginLog'
import Operator from '@/views/monitor/Operator'
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
          meta: { tTitle: '首页' },
        },
        {
          path: '/personal',
          component: Personal,
          meta: { sTitle: '个人中心', tTitle: '个人信息' },
        },
        {
          path: '/base/admin',
          component: Admin,
          meta: { sTitle: '基础管理', tTitle: '用户信息' },
        },
        {
          path: '/base/role',
          component: Role,
          meta: { sTitle: '基础管理', tTitle: '角色信息' },
        },
        {
          path: '/base/menu',
          component: Menu,
          meta: { sTitle: '基础管理', tTitle: '菜单信息' },
        },
        {
          path: '/base/dept',
          component: Dept,
          meta: { sTitle: '基础管理', tTitle: '部门信息' },
        },
        {
          path: '/base/post',
          component: Post,
          meta: { sTitle: '基础管理', tTitle: '岗位信息' },
        },
        {
          path: '/monitor/loginLog',
          component: Operator,
          meta: { sTitle: '个人中心', tTitle: '登录日志' },
        },
        {
          path: '/monitor/operator',
          component: LoginLog,
          meta: { sTitle: '个人中心', tTitle: '操作日志' },
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
