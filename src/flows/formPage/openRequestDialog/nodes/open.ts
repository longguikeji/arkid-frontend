import { StateNode } from '@/nodes/stateNode'

export class OpenRequestDialog extends StateNode {
  async run() {
    const tempState = this.getState()
    if (tempState && tempState.dialogs) {
      tempState.dialogs.request.visible = true
      // 初始化表单每一项的值 todo...
    }
  }
}
