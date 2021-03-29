import { FunctionNode } from 'arkfbp/lib/functionNode'
import getTreeData from '@/utils/get-tree-data'

export class ChangeTreeState extends FunctionNode {
  async run() {
    const state = this.$state.fetch().client
    const data = this.inputs.results
    const res = getTreeData(data)
    state.tree.nodes.data = []
    state.tree.nodes.data = res
    return this.inputs
  }
}
