import { StateNode } from '@/nodes/stateNode'

export class AddUnbindButton extends StateNode {
  async run() {
    const state = this.inputs.state
    const actionColumn = {
      label: '操作',
      scope: {
        type: 'ButtonArray',
        state: [
          {
            label: '解绑',
            type: 'danger',
            action: [
              {
                name: 'flows/thirdPartyAccount/unbind',
              }
            ]
          }
        ]
      }
    }
    state.table?.columns?.push(actionColumn)
    return {
      state: state
    }
  }
}
