import { FunctionNode } from 'arkfbp/lib/functionNode'
import OpenAPI from '@/config/openapi'

export class InitDelete extends FunctionNode {
  async run() {
    const tempState = this.inputs.state
    const initContent = this.inputs.data.initContent
    if (initContent.delete) {
      const listOperationPath = initContent.list.path
      const listOperationMethod = initContent.list.method
      const deleteOperationPath = initContent.delete.path
      const deleteOperationMethod = initContent.delete.method
      const deleteOperation = OpenAPI.instance.getOperation(deleteOperationPath, deleteOperationMethod)
      if (deleteOperation) {
        // button
        const deleteAction = {
          label: deleteOperation.summary || '删除',
          type: 'danger',
          action: [
            {
              name: 'flows/tablePage/delete',
              params: {
                deleteUrl: deleteOperationPath,
                deleteMethod: deleteOperationMethod,
                fetchUrl: listOperationPath,
                fetchMethod: listOperationMethod
              }
            }
          ]
        }
        tempState.table?.columns[tempState.table.columns.length - 1]?.scope?.state?.push(deleteAction)
      }
    }
    return {
      data: this.inputs.data,
      state: tempState
    }
  }
}
