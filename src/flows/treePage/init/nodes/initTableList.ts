import { FunctionNode } from 'arkfbp/lib/functionNode'
import OpenAPI from '@/config/openapi'
import TableColumnState from '@/admin/common/data/Table/TableColumn/TableColumnState'
import getSchemaByContent from '@/utils/get-schema-by-content'

export class InitTableList extends FunctionNode {
  async run() {
    const tempState = this.inputs.state
    const initContent = this.inputs.data.initContent

    // 对table表格机进行初始化操作
    if (initContent.tableList) {
      const tableListNodeOperationPath = initContent.tableList.path.split('?')[0]
      const tableListNodeOperationMethod = initContent.tableList.method
      const tableListNodeOperation = OpenAPI.instance.getOperation(tableListNodeOperationPath, tableListNodeOperationMethod)
      if (tableListNodeOperation) {
        // 给treePage页面中的表格添加元素信息
        const content = tableListNodeOperation.responses[200].content
        const schema = getSchemaByContent(content)
        // 给 title 赋值
        tempState.table.card.title = tableListNodeOperation.summary || ''
        // 对 table 进行初始化操作
        for (const prop in schema.properties) {
          const iprop = schema.properties[prop]
          const columnState: TableColumnState = {}
          columnState.label = iprop.title
          columnState.prop = prop
          columnState.type = iprop.type
          tempState.table.table.columns.push(columnState)
        }
      }
    }

    return {
      data: this.inputs.data,
      state: tempState,
    }
  }
}
