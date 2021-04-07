import { StateNode } from '@/nodes/stateNode'
import { TenantModule } from '@/store/modules/tenant'
import TablePageState from '@/admin/TablePage/TablePageState' 

export class SwitchTenant extends StateNode {
  async run() {
    const tenantState: TablePageState = this.getState()
    const data = tenantState.dialogs?.switch.data
    TenantModule.changeCurrentTenant(data)
    const router = this.inputs.params.router
    if (tenantState && tenantState.dialogs) {
      tenantState.dialogs.switch.visible = false
    }
    router.push({
      path: '/',
      query: {
        tenant: TenantModule.currentTenant.uuid
      }
    })
    return this.inputs
  }
}
