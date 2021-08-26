import { FunctionNode } from 'arkfbp/lib/functionNode'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'
import { TenantModule } from '@/store/modules/tenant'

export class ProcessFilterStateNode extends FunctionNode {
  async run() {
    const { state, page } = this.inputs
    const pageState: AdminComponentState = state[page]
    const filterItems = pageState.state.filter.items
    filterItems.account_ids = {
      type: 'Input',
      isSetWidth: false,
      label: '用户账号ID',
      prop: 'account_ids',
      state: {
        value: '',
        placeholder: '请输入用户账号ID'
      }
    }
    const fetchAction = pageState.state.actions.fetch[0]
    fetchAction.request.account_id = 'filter.items.account_ids.state.value'
    if (TenantModule.currentTenant.uuid) fetchAction.request.tenant_uuid = TenantModule.currentTenant.uuid
    delete fetchAction.request.account_ids
  }
}
