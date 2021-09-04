import { FunctionNode } from 'arkfbp/lib/functionNode'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'
import { getButtonIcon, getButtonDefaultLabel } from '@/utils/button'

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
            type: 'danger',
            action: 'unbind',
            icon: getButtonIcon('unbind'),
            tip: {
              content: getButtonDefaultLabel('unbind')
            },
            circle: true
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