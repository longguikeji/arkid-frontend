import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import Admin from '@/admin/main/index.vue'
import OpenAPI, { IOpenAPIRouter } from '@/config/openapi'
import { hasRouteManage } from '@/utils/role'
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

export const ROUTE_LAYER = {
  first: 1,
  second: 2,
  third: 3,
}

// 根据OpenAPI信息动态生成当前登录用户所拥有权限的路由
export function getDynamicRoutes() {
  const routes: Array<RouteConfig> = []
  const config = OpenAPI.instance.config
  const cRoutes = config?.info?.routers 
  if (!cRoutes?.length) return routes
  for (let i = 0, len = cRoutes.length; i < len; i++) {
    const route = generateRoute(cRoutes[i])
    if (route) routes.push(route)
  }
  return routes
}

function generateRoute(route: IOpenAPIRouter): RouteConfig | undefined {
  const { path, children, page, name } = route
  if (hiddenRoute(path)) return undefined
  if (page && !hasRouteManage(name, path)) return undefined
  const newRoute = {
    path: `/${path}`,
    name: path,
    redirect: `/${path}`,
    component: Layout,
    meta: getRouteMeta(route),
    children:
      children && children.length
        ? generateRouteChildren(children, ROUTE_LAYER.second)
        : [
            {
              path: '',
              name: path,
              component: Admin,
              meta: getRouteMeta(route, true),
            },
          ],
  }
  // 如果OpenAPI信息中有Children信息
  // 但是却没有获取到Children, 那么说明没有当前路由权限
  return children?.length && !newRoute.children ? undefined : newRoute
}

function generateRouteChildren(routes: IOpenAPIRouter[], layer: number) {
  const childRoutes: Array<RouteConfig> = []
  for (let i = 0, len = routes.length; i < len; i++) {
    const route = routes[i]
    const { children, path, name, page } = route
    if (page && !hasRouteManage(name, path, layer)) continue
    const childRoute = {
      path: path,
      name: `${path}_child_${i}`,
      component: Admin,
      children: children ? generateRouteChildren(children, layer + 1) : undefined,
      meta: getRouteMeta(route),
    }
    if (children?.length && !childRoute.children) continue
    childRoutes.push(childRoute)
  }
  return childRoutes.length > 0 ? childRoutes : undefined
}

function getRouteMeta(route: IOpenAPIRouter, affix?: boolean): RouteMeta {
  const { name, icon, page, url } = route
  return {
    title: name,
    icon: icon || 'dashboard',
    page,
    affix: affix || false,
    url
  }
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