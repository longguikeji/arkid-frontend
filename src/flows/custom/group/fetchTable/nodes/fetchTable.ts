import { Fetch } from '@/arkfbp/flows/fetch/nodes/fetch'
import getDataByPath from '@/utils/state'

export class FetchTable extends Fetch {
  async run() {
    const baseState = this.inputs.com.$store.state
    const groupState = getDataByPath(baseState, 'admin.adminState.group')
    const tree = groupState.state?.tree
    const group = tree?.selectedData || tree?.data![0] 
    if (group) {
      this.inputs.params = {
        group: group.uuid,
        ...this.inputs.params,
      }
      const outputs = await super.run()
      return outputs
    }
  }
}
