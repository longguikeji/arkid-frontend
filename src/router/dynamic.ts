import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import Admin from '@/admin/main/index.vue'
import { UserModule, UserRole } from '@/store/modules/user'
import OpenAPI, { ISpec, IOpenAPIRouter, ITagPage } from '@/config/openapi'
import { getApiRoles, getInitContent } from '@/utils/schema'
import { isArray } from '@/utils/common'

interface RouteMeta {
  title: string
  icon: string
  page?: string
  affix?: boolean
  hidden?: boolean
  roles?: Array<string>
}

// 根据OpenAPI信息动态生成当前登录用户所拥有权限的路由
export function getDynamicRoutes() {
  const oAPI: ISpec | undefined = OpenAPI.instance.config
  if (!oAPI?.info?.routers) return []
  const openAPIRoutes = oAPI.info.routers
  let routes: RouteConfig[] = processOpenAPIRoutes(openAPIRoutes)
  routes = filterRoutes(routes)
  return routes
}

function processOpenAPIRoutes(routes: IOpenAPIRouter[]): RouteConfig[] {
  const realRoutes: RouteConfig[] = []
  for (let i = 0, len = routes.length; i < len; i++) {
    const router = generateRoute(routes[i])
    if (!router) continue
    realRoutes.push(router)
  }
  return realRoutes
}

function generateRoute(route: IOpenAPIRouter): RouteConfig | undefined {
  const page = route.page
  if (page) {
    const isValid = getPageValidity(page)
    if (!isValid) return undefined
  }
  const { path, children } = route
  const newRoute: RouteConfig = {
    path: '/' + path,
    name: path,
    component: Layout,
    meta: getRouteMeta(route),
    children: [
      {
        path: '',
        name: path,
        component: Admin,
        meta: getRouteMeta(route, true)
      }
    ]
  }
  if (children) {
    const childRoutes = generateChildRoutes(children)
    newRoute.children = childRoutes
  }
  return newRoute
}

function generateChildRoutes(routes: IOpenAPIRouter[], isAdmin: boolean = true): RouteConfig[] {
  const childRoutes: RouteConfig[] = []
  if (routes) {
    for (let i = 0, len = routes.length; i < len; i++) {
      const page = routes[i].page
      if (page) {
        const isValid = getPageValidity(page)
        if (!isValid) continue
      }
      const { path, children } = routes[i]
      const childRoute = {
        path: path,
        name: path,
        component: isAdmin ? Admin : undefined,
        children: children ? generateChildRoutes(children, false) : undefined,
        meta: getRouteMeta(routes[i])
      }
      if (children) {
        const childrenRoutes = generateChildRoutes(children, false)
        if (!childrenRoutes.length) continue
      }
      childRoutes.push(childRoute)
    }
  }
  return childRoutes
}

function getRouteMeta(route: IOpenAPIRouter, affix?: boolean): RouteMeta {
  const { name, icon, page } = route
  const meta: RouteMeta = {
    title: name,
    icon: icon || 'dashboard',
    page: page,
    affix: affix || false
  }
  return meta
}

function getPageValidity(page: string): boolean {
  let isValid = true
  const initContent = getInitContent(page)
  if (!initContent || typeof initContent === 'string') {
    return true
  }
  let pageRoles: string[] = []
  if (isArray(initContent)) {
    (initContent as ITagPage[]).forEach(page => {
      const path = page?.init?.path
      const method = page?.init?.method
      if (path && method) {
        const roles = getApiRoles(path, method)
        pageRoles.push.apply(pageRoles, roles)
      }
    })
  } else {
    const path = (initContent as ITagPage).init?.path
    const method = (initContent as ITagPage).init?.method
    if (path && method) {
      const roles = getApiRoles(path, method)
      pageRoles.push.apply(pageRoles, roles)
    }
  }
  let currentUserRole = UserModule.role
  if (currentUserRole === UserRole.Platform) {
    currentUserRole = UserRole.User
  }
  if (pageRoles.indexOf(currentUserRole) < 0) {
    isValid = false
  }
  return isValid
}

// extra function - only staged code
function filterRoutes(routes: RouteConfig[]): RouteConfig[] {
  const role = UserModule.role
  let roleRoutes = routes
  if (role === UserRole.User) {
    roleRoutes = routes.filter((route) => {
      return route.path === '/book' || route.path === '/mine'
    })
  } else if (role === UserRole.Tenant) {
    roleRoutes = routes.filter((route) => {
      return route.path !== '/system'
    })
  }
  return roleRoutes
}
