import { UserModule, UserRole } from '@/store/modules/user'
import OpenAPI from '@/config/openapi'
import { isArray } from '@/utils/common'

export function getApiRolesByPageName(name: string): string[] {
  const info = OpenAPI.instance.getOnePageTagInfo(name)
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
  if (!operation) return []
  return operation.roles || []
}

export default function hasPermission(page: string | string[]) {
  let currentRole = UserModule.role
  if (currentRole === UserRole.Platform && page === 'tenant.create') return true
  let roles: string[] = []
  if (isArray(page)) {
    for (const p of page) {
      roles = roles.concat(getApiRolesByPageName(p))
    }
  } else {
    roles = getApiRolesByPageName(page as string)
  }
  // roles.length = 0 - only staged code
  return roles.length === 0 || roles.includes(currentRole)
}
