import { UserModule, UserRole } from '@/store/modules/user'
import OpenAPI from '@/config/openapi'
import { PermissionModule } from '@/store/modules/permission'
import { ROUTE_LAYER } from '@/router/dynamic' 

const USER_COMMON_ROUTES = [
  'message_center',
  'desktop',
  'mine',
  'contacts',
  'notice',
]

const PERMISSION_MANAGE_NAME = '权限管理'

export function getApiRolesByPageName(name: string): string[] {
  const info = OpenAPI.instance.getOnePageTag(name)
  let roles: string[] = []
  if (info?.page?.init) {
    const { path, method } = info.page.init
    if (path && method) {
      const apiRoles = getApiRolesByPath(path, method)
      roles = roles.concat(apiRoles)
    }
  }
  return roles
}

export function getApiRolesByPath(path: string, method: string) {
  const operation = OpenAPI.instance.getOperation(path, method)
  return operation ? operation.roles || [] : []
}

export function hasRouteManage(fullName: string, path: string, layer?: number) {
  if (USER_COMMON_ROUTES.includes(path)) return true
  const role = UserModule.role
  if (role === UserRole.Global) return true
  const { en_names, global_en_names } = PermissionModule
  if (role === UserRole.Tenant) {
    return !global_en_names.includes(fullName)
  } else {
    if (layer === ROUTE_LAYER.third && en_names.includes(PERMISSION_MANAGE_NAME)) {
      return true
    }
    return en_names.includes(fullName)
  }
}
