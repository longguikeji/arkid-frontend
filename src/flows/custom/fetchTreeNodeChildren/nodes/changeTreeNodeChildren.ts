import { Fetch } from '@/arkfbp/flows/fetch/nodes/fetch'
import getTreeData from '@/utils/get-tree-data'

export class ChangeTreeNodeChildren extends Fetch {
  async run() {
    const res = await super.run()
    const data = getTreeData(res.results)
    const com = this.inputs.com
    const selectedData = com.state.selectedData
    selectedData.children = data
  }
}
