import { StateNode } from '@/nodes/stateNode'
import { TenantModule } from '@/store/modules/tenant'
import TablePageState from '@/admin/TablePage/TablePageState'
import { getOriginUrl } from '@/utils/cookies'
import { getToken } from '@/utils/auth'

export class SwitchTenant extends StateNode {
  async run() {
    const tenantState: TablePageState = this.getState()
    const data: any = tenantState.dialogs?.switch.data
    TenantModule.changeCurrentTenant(data)
    if (tenantState && tenantState.dialogs) {
      tenantState.dialogs.switch.visible = false
    }
    const router = this.inputs.params.router
    const slug = data.slug
    if (slug) {
      TenantModule.setHasSlug(true)
      const host = getOriginUrl()
      const newHost = host?.replace(window.location.protocol + '//', window.location.protocol + '//' + slug + '.')
      const url = newHost + '/' + process.env.VUE_APP_BASE_API + '?token=' + getToken()
      window.location.replace(url)
    } else {
      router.push({
        path: '/',
        query: {
          tenant: TenantModule.currentTenant.uuid
        }
      })
    }
    return this.inputs
  }
}
