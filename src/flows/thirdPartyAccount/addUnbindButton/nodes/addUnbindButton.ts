import { StateNode } from '@/nodes/stateNode'
import FormPageState from '@/admin/FormPage/FormPageState'
import { FlowState } from '@/admin/base/BaseVue'

export class AddUnbindButton extends StateNode {
  async run() {
    const state: FormPageState = this.getState()
    const unbindUrl = state.form?.items?.data.state.value
    const baseAction: FlowState = state.created![1]
    state.bottomButtons = []
    if (unbindUrl) {
      state.bottomButtons?.push({
        type: 'danger',
        label: '解绑',
        action: [{
          name: 'flows/thirdPartyAccount/unbind',
          params: {
            url: unbindUrl,
            method: 'GET',
            ...baseAction.params,
          }
        }]
      })
    } else {
      state.bottomButtons = []
    }
  }
}
