import { ClientResponseNode } from '@/arkfbp/nodes/clientResponseNode'
import getTreeData from '@/utils/get-tree-data'

export class ChangeTreeState extends ClientResponseNode {
  async run() {
    const res = this.inputs
    const data = getTreeData(res.results)
    this.inputs = data
    await super.run()
  }
}
