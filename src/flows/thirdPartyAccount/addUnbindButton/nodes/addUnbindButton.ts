import { FunctionNode } from 'arkfbp/lib/functionNode'
import TablePageState, { TablePage } from '@/admin/TablePage/TablePageState'
export class AddUnbindButton extends FunctionNode {
  async run() {
    const state: TablePageState = this.inputs.state
    const tempState = state.state as TablePage
    const actionColumn = {
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
    }
    tempState.table?.columns?.push(actionColumn)
    tempState.actions!.unbind = [
      {
        name: 'flows/thirdPartyAccount/unbind'
      },
      'fetch'
    ]
    return {
      state: state
    }
  }
}