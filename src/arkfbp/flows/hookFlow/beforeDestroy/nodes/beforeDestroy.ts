import { StateNode } from '@/nodes/stateNode'

export class BeforeDestroy extends StateNode {
  async run() {
    // beforeDestory one page
    const tempState = this.getBaseState()
    if (tempState?.pages?.length) {
      const path = this.inputs.com.path
      tempState.pages.splice(tempState.pages.indexOf(path), 1)
    }
  }
}
