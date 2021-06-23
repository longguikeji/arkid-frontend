import { ClientResponseNode } from '@/arkfbp/nodes/clientResponseNode'
import getTreeData from '@/utils/get-tree-data'

export class ChangeTreeState extends ClientResponseNode {
  async run() {
    this.inputs.results = getTreeData(this.inputs.results)
    await super.run()
  }
}
