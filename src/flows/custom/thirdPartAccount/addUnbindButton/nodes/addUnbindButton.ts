import { FunctionNode } from 'arkfbp/lib/functionNode'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'

export class AddUnbindButton extends FunctionNode {
  async run() {
    const { state, page } = this.inputs
    const pageState: AdminComponentState = state[page]
    pageState.state.table?.columns?.push({
      label: '操作',
      prop: 'actions',
      width: '50',
      scope: {
        type: 'ButtonDropdown',
        state: [
          {
            label: '解绑',
            type: 'danger',
            action: 'unbind',
            icon: 'el-icon-connection'
          }
        ]
      }
    })
    pageState.state.actions!.unbind = [
      {
        name: 'flows/custom/thirdPartAccount/unbind'
      },
      'fetch'
    ]
  }
}