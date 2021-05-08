import { FunctionNode } from 'arkfbp/lib/functionNode'
import { TreePage } from '@/admin/TreePage/TreePageState'
import { runFlowByFile } from '@/arkfbp/index'

export class InitTable extends FunctionNode {
  async run() {
    const tempState: TreePage = this.inputs.state
    const { initContent } = this.inputs.data
    if (initContent.table) {
      const initTablePath = initContent.table.init.path
      const initTableMethod = initContent.table.init.method
      initContent.table.init.path = initContent.table.init.path.split('?')[0]
      await runFlowByFile('flows/base/tablePage', {
        initContent: initContent.table,
        isHooks: false
      }).then(async (data) => {
        const tableState = data.state
        tempState.table = tableState        
      })
      tempState.actions!.fetchTable = [
        {
          name: 'arkfbp/flows/fetch',
          url: initTablePath,
          method: initTableMethod,
          response: {
            'table.state.table.data': 'results'
          }
        }
      ]
    }
    return {
      data: this.inputs.data,
      state: tempState
    }
  }
}
