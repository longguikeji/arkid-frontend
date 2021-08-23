import { Fetch } from '@/arkfbp/flows/fetch/nodes/fetch'
import getTreeData from '@/utils/get-tree-data'

export class ChangeTreeNodeState extends Fetch {
  async run() {
    const res = await super.run()
    const data = getTreeData(res.results)
    const com = this.inputs.com
    const node = com.state.node
    node.children = data
  }
}
