import { Fetch } from '@/arkfbp/flows/fetch/nodes/fetch'
import getDataByPath from '@/utils/datapath'
import TreePageState from '@/admin/TreePage/TreePageState'

export class FetchTable extends Fetch {
  async run() {
    const baseState = this.inputs.com.$store.state
    const groupState: TreePageState = getDataByPath(baseState, 'admin.adminState[0]')
    const tree = groupState.state?.tree
    const group = tree?.selectedData || tree?.data![0] 
    if (group) {
      this.inputs.params = {
        group: group.uuid,
        ...this.inputs.params,
      }
      const outputs = await super.run()
      return outputs
    } else {
      return null
    }
  }
}
