import { FunctionNode } from 'arkfbp/lib/functionNode'
import TablePageState from '@/admin/TablePage/TablePageState'

export class InitSortable extends FunctionNode {
  async run() {
    const tempState = this.inputs.state as TablePageState
    const initContent = this.inputs.data.initContent
    if (initContent.sort) {
      const sortOperationPath = initContent.sort.path
      const sortOperationMethod = initContent.sort.method
      const listOperationPath = initContent.list.path
      const listOperationMethod = initContent.list.method
      if (tempState.table) {
        tempState.table.sortable = true
        tempState.table.sortAction = [
          {
            name: 'flows/tablePage/sort',
            params: {
              sortUrl: sortOperationPath,
              sortMethod: sortOperationMethod,
            }
          }
        ]
      }
    }
    
    return {
      data: this.inputs.data,
      state: tempState
    }
  }
}
