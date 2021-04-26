import { AuthApiNode } from '@/nodes/authApiNode'
import { runFlowByFile } from '@/arkfbp/index'
import TablePageState from '@/admin/TablePage/TablePageState'
import { FlowState } from '@/admin/base/BaseVue'

export class Unbind extends AuthApiNode {
  async run() {
    const tempState: TablePageState = this.getState()
    const data = this.inputs.com.state.data
    this.url = data.unbind
    this.method = 'GET'
    const created = tempState.created
    if (created) {
      const inputs = created[1] as FlowState
      await super.run().then(async () => {
        await runFlowByFile('flows/tablePage/fetch', inputs)
      })
    }
  }
}
