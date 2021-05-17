import { TenantModule } from '@/store/modules/tenant'
import { AdminModule } from '@/store/modules/admin'
import getBaseUrl from './get-base-url'

function getStateByPath(tempState: any, path: string) {
  if (path === '' || path === 'admin.adminState' || path === 'tenant.tenantState' || path === undefined) {
    return tempState
  } else {
    const tempPath = path.replace('admin.adminState.', '').replace('tenant.tenantState.', '')
    let reTempState = tempState
    const paths = tempPath.split('.')
    for (const p of paths) {
      if (p.indexOf('[') > 0) {
        const index = Number(p.slice(p.indexOf('[') + 1, p.indexOf(']')))
        reTempState = reTempState[index]
      } else {
        reTempState = reTempState[p]
      }
    }
    return reTempState
  }
}

export default function getPageState(specifiedPath = '') {
  const tempState = getBaseState()
  if (!tempState) return
  let path = ''
  if (specifiedPath) {
    path = specifiedPath
  } else if (tempState?.pages) {
    path = tempState?.pages[tempState.pages.length - 1]
  }
  return getStateByPath(tempState, path)
}

export function getPreviousPageState() {
  const tempState = getBaseState()
  if (!tempState) return
  const path = tempState.pages.length === 1 ? tempState.pages[tempState.pages.length - 1] : tempState.pages[tempState.pages.length - 2]
  return getStateByPath(tempState, path)
}

export function getBaseState() {
  return isTenantState() ? TenantModule.tenantState : AdminModule.adminState
}

export function isTenantState() {
  const baseUrl = getBaseUrl()
  return (location.hash === '#' + baseUrl + '/tenant' || location.pathname === baseUrl + '/tenant')
}
