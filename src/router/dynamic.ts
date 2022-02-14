import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import Admin from '@/admin/main/index.vue'
import { UserModule, UserRole } from '@/store/modules/user'
import OpenAPI, { ISpec, IOpenAPIRouter } from '@/config/openapi'
import hasPermission from '@/utils/role'
import { ConfigModule } from '@/store/modules/config'

interface RouteMeta {
  title: string
  icon: string
  page?: string
  affix?: boolean
  hidden?: boolean
  url?: string
  roles?: Array<string>
}

const USER_COMMON_ROUTES = [
  "/message_center",
  "/desktop",
  "/mine",
  "/contacts",
  "/notice"
];

// 根据OpenAPI信息动态生成当前登录用户所拥有权限的路由
export function getDynamicRoutes() {
  const openAPI: ISpec | undefined = OpenAPI.instance.config
  if (!openAPI?.info?.routers) return []
  const openAPIRoutes = openAPI.info.routers
  let routes: RouteConfig[] = generateRoutesByOpenAPI(openAPIRoutes)
  routes = filterRoutes(routes)
  return routes
}

function generateRoutesByOpenAPI(routes: IOpenAPIRouter[]): RouteConfig[] {
  const rs: RouteConfig[] = []
  for (const route of routes) {
    const r = generateRoute(route)
    if (r) {
      rs.push(r)
    }
  }
  return rs
}

function generateRoute(route: IOpenAPIRouter): RouteConfig | undefined {
  const { path, children, page } = route
  const isHidden = hiddenRoute(path)
  if (isHidden) {
    return undefined
  }
  if (page && !hasPermission(page)) {
    return undefined
  }
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
    for (const route of routes) {
      const { page, name, children, path } = route
      if (name && hiddenChildManagerRoute(name, children)) continue
      if (page && !hasPermission(page)) continue
      const childRoute = {
        path: path,
        name: path,
        component: isAdmin ? Admin : undefined,
        children: children ? generateChildRoutes(children, false) : undefined,
        meta: getRouteMeta(route)
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
  const { name, icon, page, url } = route
  const meta: RouteMeta = {
    title: name,
    icon: icon || 'dashboard',
    page,
    affix: affix || false,
    url
  }
  return meta
}

function filterRoutes(routes: RouteConfig[]): RouteConfig[] {
  const role = UserModule.role
  let roleRoutes = routes
  if (role === UserRole.User || role === UserRole.Platform) {
    roleRoutes = routes.filter((route) => {
      return route.path ? USER_COMMON_ROUTES.includes(route.path) : false
    })
  } else if (role === UserRole.Tenant) {
    roleRoutes = routes.filter((route) => {
      return route.path !== '/system'
    })
  }
  return roleRoutes
}

function hiddenChildManagerRoute(name: string, children?: IOpenAPIRouter[]): boolean {
  const { isAllShow, isAllApplication, visibleSidebarItems } = ConfigModule.childManagerPermissions
  let isHidden = true
  if (visibleSidebarItems?.length === 0) {
    if (isAllShow) {
      isHidden = false
    } else if (isAllApplication && name === '应用管理') {
      isHidden = false
    } else {
      isHidden = true
    }
  } else {
    if (children) {
      for (const child of children) {
        if (visibleSidebarItems?.includes(child.name)) {
          isHidden = false
          break
        }
      }
    } else if (visibleSidebarItems?.includes(name)) {
      isHidden = false
    }
  }
  return isHidden
}

function hiddenRoute(path: string): boolean {
  if (path === 'desktop') {
    return !ConfigModule.desktop.visible
  } else if (path === 'contacts') {
    return !ConfigModule.contacts.isOpen
  } else {
    return false
  }
}