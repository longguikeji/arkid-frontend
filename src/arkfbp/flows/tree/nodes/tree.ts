import { ClientResponseNode } from '@/arkfbp/nodes/clientResponseNode'
import { getTreeData } from '@/utils/flow'

export class TreeNode extends ClientResponseNode {
  async run() {
    let results = this.inputs.results
    if (results?.length > 0) {
      this.inputs.results = getTreeData(results)
      return await super.run()
    }
  }
}
