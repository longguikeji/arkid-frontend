import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'
import { TenantModule } from '@/store/modules/tenant'
import { UserModule, UserRole } from '@/store/modules/user'
import { getDynamicRoutes } from './dynamic'
import { getToken } from '@/utils/auth'
import { ConfigModule } from '@/store/modules/config'

/* Solve the problem of router repeatedly jumping to the same route */
const originalPush = Router.prototype.push
Router.prototype.push = function push(location: any) {
  return (originalPush.call(this, location) as any).catch((err: any) => err)
}

Vue.use(Router)

const ROUTE_PATH = {
  login: '/login',
  third: '/third_part_callback',
  url: '/url',
  tenant: '/tenant',
  desktop: '/desktop',
  mine: '/mine',
  home: '/',
}

export const menuRoutes: RouteConfig[] = [
  {
    path: ROUTE_PATH.login,
    component: () => import('@/login/Login.vue'),
    meta: { hidden: true },
  },
  {
    path: ROUTE_PATH.third,
    component: () => import('@/login/ThirdPartCallback.vue'),
    meta: { hidden: true },
  },
  {
    path: ROUTE_PATH.url,
    component: () => import('@/views/Url.vue'),
    meta: { hidden: true },
  },
  {
    path: ROUTE_PATH.tenant,
    component: () => import('@/views/Tenant.vue'),
    meta: { hidden: true, page: 'tenant' },
  },
  ...getDynamicRoutes(),
]

const createRouter = () =>
  new Router({
    mode: 'history',
    scrollBehavior: (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
    },
    base: process.env.VUE_APP_BASE_API,
    routes: [...menuRoutes],
  })

const router = createRouter()

router.beforeEach((to, from, next) => {
  const token = getToken()
  const uuid = TenantModule.currentTenant.uuid
  const role = UserModule.role
  const visible = ConfigModule.desktop.visible
  const url = ConfigModule.origin
  const sw = TenantModule.tenantSwitch
  const platform = TenantModule.isPlatformTenant
  let nextUrl = ''
  const { query, path } = to
  if (token && url === '') {
    nextUrl = path === ROUTE_PATH.url ? nextUrl : ROUTE_PATH.url
  } else if (token && !query?.next) {
    const target = visible
      ? path === ROUTE_PATH.desktop
        ? nextUrl
        : ROUTE_PATH.desktop
      : ROUTE_PATH.mine
    switch (path) {
      case ROUTE_PATH.desktop:
      case ROUTE_PATH.third:
      case ROUTE_PATH.url:
        nextUrl = target
        break
      case ROUTE_PATH.tenant:
        nextUrl = sw && role !== UserRole.User ? nextUrl : target
        break
      case ROUTE_PATH.login:
      case ROUTE_PATH.home:
        nextUrl =
          sw && (role === UserRole.Platform || platform)
            ? ROUTE_PATH.tenant
            : target
        break
    }
  } else if (!token) {
    if (uuid) query.tenant = uuid
    switch (path) {
      case ROUTE_PATH.login:
      case ROUTE_PATH.third:
        break
      default:
        nextUrl = ROUTE_PATH.login
    }
  }
  nextUrl === '' ? next() : next(nextUrl)
})

export default router
