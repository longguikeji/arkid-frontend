import { TenantModule } from '@/store/modules/tenant'
import { AdminModule } from '@/store/modules/admin'

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
  const tempState = getCurrentRequiredState()
  const path = specifiedPath === '' ? tempState.pages[tempState.pages.length - 1] : specifiedPath
  return getStateByPath(tempState, path)
}

export function getPreviousPageState() {
  const tempState = getCurrentRequiredState()
  const path = tempState.pages.length === 1 ? tempState.pages[tempState.pages.length - 1] : tempState.pages[tempState.pages.length - 2]
  return getStateByPath(tempState, path)
}

export function getFirstPageState() {
  const tempState = getCurrentRequiredState()
  const path = tempState.pages[0]
  return getStateByPath(tempState, path)
}

export function getCurrentRequiredState() {
  const tempState = isTenantState() ? TenantModule.tenantState : AdminModule.adminState
  if (!tempState) return
  return tempState
}

export function isTenantState() {
  return (location.hash === '#/tenant' || location.pathname === '/tenant')
}
