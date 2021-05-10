import { TenantModule } from '@/store/modules/tenant'
import { AdminModule } from '@/store/modules/admin'
import { getBaseUrl } from './url'
import { getOneCharacterIndexsInString } from '@/utils/common'
import getDateByPath from '@/utils/datapath'

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

export function getPageState(path: string) {
  let state = getStateByComponentPath(path)
  const isMultiPageState = state?.type === 'TablePage' || state?.type === 'FormPage' || state?.type === 'TreePage' || state?.type === 'DashboardPage'
  if (isMultiPageState) {
    state = state.state
  } else {
    state = null
  }
  return state
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
      const state = getPageState(pathMapping[i])
      if (state) {
        tempState = state
        break
      }
    }
  }
  return tempState
}

export function getBaseState() {
  return isTenantState() ? TenantModule.tenantState.state : AdminModule.adminState.state
}

export function isTenantState() {
  const baseUrl = getBaseUrl()
  return (location.hash === '#' + baseUrl + '/tenant' || location.pathname === baseUrl + '/tenant')
}
