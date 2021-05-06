import { StateNode } from '@/nodes/stateNode'

export class Created extends StateNode {
  async run() {
    // add current page
    const tempState = this.getBaseState()
    if (tempState) {
      const path = this.inputs.com.path
      if (tempState.pages.indexOf(path) < 0) {
        tempState.pages.push(path)
      }
    }
  }
}