import { FunctionNode } from 'arkfbp/lib/functionNode'
import { TenantModule } from '@/store/modules/tenant'
import TablePageState from '@/admin/TablePage/TablePageState' 

export class SwitchTenant extends FunctionNode {
  async run() {
    const tenantState: TablePageState = this.inputs.com.$store.state.tenant.tenantState
    const data = tenantState.dialogs?.switch.data
    TenantModule.changeCurrentTenant(data)
    const router = this.inputs.params.router
    if (tenantState && tenantState.dialogs) {
      tenantState.dialogs.switch.visible = false
    }
    router.push('/')
    return this.inputs
  }
}
