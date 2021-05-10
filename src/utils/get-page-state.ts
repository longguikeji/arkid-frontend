import { TenantModule } from '@/store/modules/tenant'
import { AdminModule } from '@/store/modules/admin'
import { getBaseUrl } from './url'
import { getOneCharacterIndexsInString } from '@/utils/common'
import getDateByPath from '@/utils/datapath'

export function getStateByPath(path: string) {
  const tempState = getBaseState()
  if (path === '' || path === 'admin.adminState.state' || path === 'tenant.tenantState.state' || path === undefined) {
    return tempState
  } else {
    let reTempState = tempState
    const tempPath = path.replace('admin.adminState.state.', '').replace('tenant.tenantState.state.', '')
    if (reTempState) {
      reTempState = getDateByPath(reTempState, tempPath)
    }
    const isPageState = reTempState?.type === 'TablePage' || reTempState?.type === 'FormPage' || reTempState?.type === 'TreePage' || reTempState?.type === 'DashboardPage'
    if (isPageState) {
      reTempState = reTempState.state
      return reTempState
    } else {
      return null
    }
  }
}

export function getStateByComponentPath(path: string) {
  const tempState = getBaseState()
  if (path === '' || path === 'admin.adminState.state' || path === 'tenant.tenantState.state' || path === undefined) {
    return tempState
  } else {
    let reTempState = tempState
    const tempPath = path.replace('admin.adminState.state.', '').replace('tenant.tenantState.state.', '')
    reTempState = getDateByPath(reTempState, tempPath)
    return reTempState
  }
}

export function getCurrentPageStateByPath(path: string) {
  let tempState = getBaseState()
  if (path) {
    const indexs = getOneCharacterIndexsInString(path, '.')
    const pathMapping: Array<string> = []
    pathMapping.push(path)
    for (let i = indexs.length - 1; i >= 0; i--) {
      const iPath = path.substring(0, indexs[i])
      pathMapping.push(iPath)
    }
    pathMapping.push('')
    for (let i = 0; i <= pathMapping.length - 1; i++) {
      const state = getStateByPath(pathMapping[i])
      if (state) {
        tempState = state
        break
      }
    }
  }
  return tempState
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
  return getStateByPath(path)
}

export function getPreviousPageState() {
  const tempState = getBaseState()
  if (!tempState) return
  const path = tempState.pages.length === 1 ? tempState.pages[tempState.pages.length - 1] : tempState.pages[tempState.pages.length - 2]
  return getStateByPath(path)
}

export function getBaseState() {
  return isTenantState() ? TenantModule.tenantState.state : AdminModule.adminState.state
}

export function isTenantState() {
  const baseUrl = getBaseUrl()
  return (location.hash === '#' + baseUrl + '/tenant' || location.pathname === baseUrl + '/tenant')
}
