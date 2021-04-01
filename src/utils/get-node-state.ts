import { TenantModule } from '@/store/modules/tenant'
import { AdminModule } from '@/store/modules/admin'

export default function getNodeState(path: string = '') {
  const tempState = location.pathname === '/tenant' ? TenantModule.tenantState : AdminModule.adminState
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