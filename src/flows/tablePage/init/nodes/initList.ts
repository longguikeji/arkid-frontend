import { FunctionNode } from 'arkfbp/lib/functionNode'
import OpenAPI, { ISchema } from '@/config/openapi'
import TableColumnState from '@/admin/common/data/Table/TableColumn/TableColumnState'
import getSchemaByContent from '@/utils/get-schema-by-content'

export class InitList extends FunctionNode {
  async run() {
    const tempState = this.inputs.state
    const initContent = this.inputs.data.initContent
    if (initContent.list) {
      const listOperationPath = initContent.list.path
      const listOperationMethod = initContent.list.method
      const listOperation = OpenAPI.instance.getOperation(listOperationPath, listOperationMethod)
      if (listOperation) {
        // 给 created 赋值
        tempState.created.push({
          name: 'flows/tablePage/fetch',
          params: {
            fetchUrl: listOperationPath,
            fetchMethod: listOperationMethod
          }
        })
        // 给 title 赋值
        tempState.card.title = listOperation.summary || ''
        // 对 table 进行初始化操作
        const content = listOperation.responses[200].content
        const schema = getSchemaByContent(content)
        for (const prop in schema.properties) {
          const iprop = schema.properties[prop]
          if (iprop.writeOnly) continue
          if (initContent.hiddenReadOnly && iprop.readOnly) continue
          const columnState:TableColumnState = {}
          columnState.label = iprop.title
          columnState.prop = prop
          columnState.type = iprop.type
          tempState.table?.columns?.push(columnState)
        }
        // 对 pagination 分页进行初始化操作
        tempState.pagination = {
          currentPage: 1,
          pageSize: 10,
          total: 0,
          action: [
            {
              name: 'flows/tablePage/fetch',
              params: {
                fetchUrl: listOperationPath,
                fetchMethod: listOperationMethod
              }
            }
          ]
        }
      }
    }
    return {
      data: this.inputs.data,
      state: tempState
    }
  }
}
