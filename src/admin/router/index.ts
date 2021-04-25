import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import Admin from '@/admin/main/index.vue'
import { UserModule } from '@/store/modules/user'

// initRouterFromOpenAPI
// 该方法用于根据OpenAPI生成动态的路由结构
// 之后该方法需要进一步根据OpenAPI的字段信息进行补充和完善
// 通过补充和完善体现该方法的扩展性和适应性
export function initRouterFromOpenAPI(openAPI: any) {
  if (!openAPI) return []
  const originRouters = openAPI.info.routers
  const routers: RouteConfig[] = generateAsyncRoutersByOpenApiInfo(originRouters)
  return routers
}

// 根据 OpenAPI 的 info 内容生成 routers
function generateAsyncRoutersByOpenApiInfo(originRouters: any) {
  const routers: RouteConfig[] = [];
  const currentUserRole = UserModule.userRole
  originRouters.forEach(originRouterItem => {
    if (originRouterItem.role.indexOf(currentUserRole) >= 0) {
      const routerIntem = generateRouterItem(originRouterItem)
      routers.push(routerIntem)
    }
  })
  return routers
}

// 生成某条路由信息
function generateRouterItem(tempRouter: any): RouteConfig {
  return {
    path: '/' + tempRouter.path,
    name: tempRouter.path,
    component: Layout,
    children: tempRouter.children ? generateRouterChildren(tempRouter.children, true) : [
      {
        path: '',
        name: tempRouter.path,
        component: Admin,
        meta: {
          title: tempRouter.name,
          icon: tempRouter.icon || 'dashboard',
          page: tempRouter.page,
          affix: true
        }
      }
    ],
    meta: {
      title: tempRouter.name,
      icon: tempRouter.icon || 'dashboard',
      page: tempRouter.page,
      role: tempRouter.role,
    }
  }
}

// 生成某条路由信息中的children信息, 可以进行多次嵌套，以便之后的扩展使用
function generateRouterChildren(tempChildren: any, flag: boolean) {
  if (!tempChildren) {
    return []
  }
  const childrenSet: Array<any> = []
  tempChildren.forEach((c => {
    childrenSet.push({
      path: c.path,
      name: c.path,
      component: flag ? Admin : null,
      children: c.children ?  generateRouterChildren(c.children, false) : null,
      meta: {
        title: c.name,
        icon: c.icon || 'dashboard',
        affix: false,
        page: c.page
      }
    })
  }))
  return childrenSet
}
