import { StateNode } from '@/nodes/stateNode'
import TablePageState from '@/admin/TablePage/TablePageState'
export class AddUnbindButton extends StateNode {
  async run() {
    const tempState: TablePageState = this.inputs.state
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
    tempState.actions!['unbind'] = [
      {
        name: 'flows/thirdPartyAccount/unbind'
      }
    ]
    return {
      state: tempState
    }
  }
}