import { UserModule, UserRole } from '@/store/modules/user'
import OpenAPI from '@/config/openapi'
import { isArray } from '@/utils/common'
import { PermissionModule } from '@/store/modules/permission'

const USER_COMMON_ROUTES = [
  'message_center',
  'desktop',
  'mine',
  'contacts',
  'notice',
]

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

export function hasRouteManage(fullName: string, path: string) {
  if (USER_COMMON_ROUTES.includes(path)) return true
  const role = UserModule.role
  if (role === UserRole.Global) return true
  const { en_names, global_en_names } = PermissionModule
  if (role === UserRole.Tenant) {
    return !global_en_names.includes(fullName)
  } else {
    return en_names.includes(fullName)
  }
}
