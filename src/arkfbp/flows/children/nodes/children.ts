import { Fetch } from '@/arkfbp/flows/fetch/nodes/fetch'
import { getTreeData } from '@/utils/flow'

export class ChildrenNode extends Fetch {
  async run() {
    const { com } = this.inputs
    const res = await super.run()
    const data = getTreeData(res.results)
    if (data && data.length > 0) {
      const node = com.state.node
      node.children.splice(0, node.children.length)
      node.children = data
    }
  }
}
