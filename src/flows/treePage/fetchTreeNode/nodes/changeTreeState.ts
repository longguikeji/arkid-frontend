import { FunctionNode } from 'arkfbp/lib/functionNode'
import getTreeData from '@/utils/get-tree-data'
import { setButtonStatus } from '@/utils/btn'

export class ChangeTreeState extends FunctionNode {
  async run() {
    const state = this.$state.fetch().client
    const data = this.inputs.results
    const res = getTreeData(data)
    state.tree.nodes.data = []
    state.tree.nodes.data = res
    const buttons = state.tree.header?.buttons
    if (res?.length) {
      setButtonStatus(buttons, false)
    } else {
      setButtonStatus(buttons, true)
    }
    return this.inputs
  }
}
