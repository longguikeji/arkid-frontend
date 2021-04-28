import { FunctionNode } from 'arkfbp/lib/functionNode'
import TreePageState from '@/admin/TreePage/TreePageState'
import { runFlowByFile } from '@/arkfbp/index'

export class InitTable extends FunctionNode {
  async run() {
    const tempState: TreePageState = this.inputs.state
    const { initContent } = this.inputs.data
    if (initContent.table) {
      initContent.table.init.path = initContent.table.init.path.split('?')[0]
      await runFlowByFile('flows/base/tablePage', {
        initContent: initContent.table,
        isHooks: false
      }).then(async (data) => {
        const tableState = data.state
        tempState.table = tableState        
      })
    }
    return {
      data: this.inputs.data,
      state: tempState
    }
  }
}
