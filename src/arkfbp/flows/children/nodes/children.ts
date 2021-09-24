import { Fetch } from '@/arkfbp/flows/fetch/nodes/fetch'
import { getTreeData } from '@/utils/flow'

export class ChildrenNode extends Fetch {
  async run() {
    const res = await super.run()
    const data = getTreeData(res.results)
    const com = this.inputs.com
    const node = com.state.node
    node.children = data
  }
}
