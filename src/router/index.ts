import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'
import { TenantModule } from '@/store/modules/tenant'
import { UserModule, UserRole } from '@/store/modules/user'
import { getDynamicRoutes } from './dynamic'
import { getToken } from '@/utils/auth'
import { ConfigModule } from '@/store/modules/config'

/* Solve the problem of router repeatedly jumping to the same route */
const originalPush = Router.prototype.push
Router.prototype.push = function push (location: any) {
  return (originalPush.call(this, location) as any).catch((err: any) => err)
}

Vue.use(Router)

/**
  MenuRoutes
*/
export const menuRoutes: RouteConfig[] = [
  {
    path: '/login',
    component: () => import('@/login/Login.vue'),
    meta: { hidden: true }
  },
  {
    path: '/third_part_callback',
    component: () => import('@/login/ThirdPartCallback.vue'),
    meta: { hidden: true }
  },
  {
    path: '/tenant',
    component: () => import('@/views/Tenant.vue'),
    meta: { hidden: true, page: 'tenant' }
  },
  ...getDynamicRoutes()
]

const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.VUE_APP_BASE_API,
  routes: [...menuRoutes]
})

const router = createRouter()

router.beforeEach((to, from, next) => {
  const isLogin = getToken()  
  const tenantUUId = TenantModule.currentTenant.uuid
  const role = UserModule.role
  const isVisibleDesktop = ConfigModule.desktop.visible
  let nextUrl = ''
  if (isLogin) {
    if (to.query.next) {
      next()
    } else if (to.path === '/login' || to.path === '/third_part_callback') {
      if (!isVisibleDesktop) {
        nextUrl = '/mine/profile'
      } else {
        nextUrl = '/desktop'
      }
    } else if (to.path === '/tenant') {
      if (role === UserRole.User || TenantModule.tenantSwitch === false) {
        if (!isVisibleDesktop) {
          nextUrl = '/mine/profile'
        } else {
          nextUrl = '/desktop'
        }
      } else {
        next()
      }
    } else if (to.path === '/desktop') {
      if (!isVisibleDesktop) {
        nextUrl = '/mine/profile'
      } else {
        nextUrl = ''
      }
    } else if (to.path === '/') {
      nextUrl = '/desktop'
    }
  } else {
    if (tenantUUId) {
      to.query.tenant = tenantUUId
    }
    if (to.path !== '/login' && to.path !== '/third_part_callback') {
      nextUrl = '/login'
    }
  }

  if (nextUrl === '') {
    next()
  } else {
    next(nextUrl)
  }
})

export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router
