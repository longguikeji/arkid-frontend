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

export function hasPermissionByPath(path: string, method: string) {
  return true
  // let currentRole = UserModule.role
  // if (method === 'open') return true
  // if (currentRole === UserRole.Platform) return true
  // const roles = getApiRolesByPath(path, method)
  // return roles.includes(currentRole)
}

export default function hasPermission(page: string | string[]) {
  return true
  // let currentRole = UserModule.role
  // if (currentRole === UserRole.Platform) return true
  // if (currentRole !== UserRole.Global && page === 'all_tenant') return false
  // let roles: string[] = []
  // if (isArray(page)) {
  //   for (const p of page) {
  //     roles = roles.concat(getApiRolesByPageName(p))
  //   }
  // } else {
  //   roles = getApiRolesByPageName(page as string)
  // }
  // // roles.length = 0 - only staged code
  // return roles.length === 0 || roles.includes(currentRole)
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
