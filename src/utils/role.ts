import { UserModule, UserRole } from '@/store/modules/user'
import OpenAPI, { ITagPage } from '@/config/openapi'
import { isArray } from '@/utils/common'

export function getApiRolesByPageName(name: string): string[] {
  const pageTagInfo = OpenAPI.instance.getOnePageTagInfo(name)
  let roles: string[] = []
  if (pageTagInfo) {
    const { page } = pageTagInfo
    if (page) {
      const isMultiPage = isArray(page)
      if (isMultiPage) {
        for (const p of page as string[]) {
          const pageRoles = getApiRolesByPageName(p)
          roles = roles.concat(pageRoles)
        }
      } else {
        const { path, method } = (page as ITagPage).init
        if (path && method) {
          const apiRoles = getApiRolesByPath(path, method)
          roles = roles.concat(apiRoles)
        }
      }
    }
  }
  return roles
}

export function getApiRolesByPath(path: string, method: string) {
  const operation = OpenAPI.instance.getOperation(path, method)
  return operation.roles || []
}

export default function hasPermission(page: string) {
  let currentRole = UserModule.role
  if (currentRole === UserRole.Platform) currentRole = UserRole.User
  const roles = getApiRolesByPageName(page)
  // roles.length = 0 - only staged code
  return roles.length === 0 || roles.includes(currentRole)
}
