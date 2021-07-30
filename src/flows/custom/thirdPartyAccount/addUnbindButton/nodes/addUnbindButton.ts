import { FunctionNode } from 'arkfbp/lib/functionNode'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'
export class AddUnbindButton extends FunctionNode {
  async run() {
    const { state, page } = this.inputs
    const pageState: AdminComponentState = state[page]
    pageState.state.table?.columns?.push({
      label: '操作',
      scope: {
        type: 'ButtonArray',
        state: [
          {
            label: '解绑',
            type: 'danger',
            action: 'unbind'
          }
        ]
      }
    })
    pageState.state.actions!.unbind = [
      {
        name: 'flows/thirdPartyAccount/unbind'
      },
      'fetch'
    ]
  }
}