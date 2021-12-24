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
  const uuid = TenantModule.currentTenant.uuid
  const role = UserModule.role
  const isVisibleDesktop = ConfigModule.desktop.visible
  const tenantSwitch = TenantModule.tenantSwitch
  const isPlatformTenant = TenantModule.isPlatformTenant
  let nextUrl = ''
  const { query, path } = to
  if (isLogin) {
    if (query && query.next) {
      nextUrl = ''
    } else {
      const t = isVisibleDesktop ? ( path === '/desktop' ? '' : '/desktop' ) : '/mine'
      switch(path) {
        case '/third_part_callback':
        case '/desktop':
          nextUrl = t
          break
        case '/tenant':
          nextUrl = tenantSwitch === true ? (
            role === UserRole.Platform || role !== UserRole.User ? '' : t
          ) : t
          break
        case '/login':
        case '/':
          nextUrl = ((role === UserRole.Platform || isPlatformTenant) && tenantSwitch === true) ? '/tenant' : t
          break
        default:
          nextUrl = ''
      }
    }
  } else {
    if (uuid) query.tenant = uuid
    if (path !== '/login' && path !== '/third_part_callback') {
      nextUrl = '/login'
    }
  }

  nextUrl === '' ? next() : next(nextUrl)
})

export default router
