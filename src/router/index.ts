import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'
/* Layout */
import Layout from '@/layout/index.vue'

import { initRouterFromOpenAPI } from '@/admin/router/index'
import OpenAPI from '@/config/openapi'
/* Solve the problem of router repeatedly jumping to the same route */
const originalPush = Router.prototype.push
Router.prototype.push = function push (location: any) {
  return (originalPush.call(this, location) as any).catch((err: any) => err)
}

Vue.use(Router)

/*
  Note: sub-menu only appear when children.length>=1
  Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
*/

/*
  name:'router-name'             the name field is required when using <keep-alive>, it should also match its component's name property
                                 detail see : https://vuejs.org/v2/guide/components-dynamic-async.html#keep-alive-with-Dynamic-Components
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    roles: ['admin', 'editor']   will control the page roles (allow setting multiple roles)
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    hidden: true                 if true, this route will not show in the sidebar (default is false)
    alwaysShow: true             if true, will always show the root menu (default is false)
                                 if false, hide the root menu when has less or equal than one children route
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    noCache: true                if true, the page will not be cached (default is false)
    affix: true                  if true, the tag will affix in the tags-view
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
*/

/**
  MenuRoutes
*/
export const menuRoutes: RouteConfig[] = [
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/login/Login.vue'),
    meta: { hidden: true }
  },
  {
    path: '/third_part_callback',
    component: () => import(/* webpackChunkName: "login" */ '@/login/ThirdPartCallback.vue'),
    meta: { hidden: true }
  },
  {
    path: '/tenant',
    component: () => import(/* webpackChunkName: "login" */ '@/views/tenant/TenantManager.vue'),
    meta: { hidden: true, page: 'tenant' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/desktop',
    children: [
      {
        path: 'desktop',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/Desktop.vue'),
        name: 'desktop',
        meta: {
          title: '桌面',
          icon: 'desktop',
          affix: true
        }
      }
    ]
  },
  ...initRouterFromOpenAPI(OpenAPI.instance.config)
]

/**
  HideRoutes
*/
// export const hideRoutes: RouteConfig[] = initRouterFromConfig('router.modules.hideRouter')

const createRouter = () => new Router({
  mode: 'hash', // Disabled due to Github Pages doesn't support this, enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: [...menuRoutes]
})

const router = createRouter()

router.beforeEach((to, from, next) => {
  let isLogin = localStorage.getItem('token')
  if (isLogin) {
    if (to.path === '/login') {
      next(from.fullPath)
    } else {
      next()
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next('/login')
    }
  }
})

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
