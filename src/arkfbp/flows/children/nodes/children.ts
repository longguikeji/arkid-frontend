import { Fetch } from '@/arkfbp/flows/fetch/nodes/fetch'
import { getTreeData } from '@/utils/flow'

export class ChildrenNode extends Fetch {
  async run() {
    const { com } = this.inputs
    const res = await super.run()
    const data = getTreeData(res.results)
    const node = com.state.node
    node.children = data
  }
}
