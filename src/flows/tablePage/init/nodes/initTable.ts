import { FunctionNode } from 'arkfbp/lib/functionNode'
import OpenAPI from '@/config/openapi'
import TableColumnState from '@/admin/common/data/Table/TableColumn/TableColumnState'
import getSchemaByContent from '@/utils/get-schema-by-content'

export class InitTable extends FunctionNode {
  async run() {
    const tempState = this.inputs.state
    const { initContent, ...otherInitContent } = this.inputs.data
    let baseAction = {
      fetchUrl: '',
      fetchMethod: ''
    }
    if (initContent?.init?.path) {
      const initTablePath = initContent.init.path as string
      const initTableMethod = initContent.init.method as string || 'GET'
      const initTableOperation = OpenAPI.instance.getOperation(initTablePath, initTableMethod)
      baseAction.fetchUrl = initTablePath
      baseAction.fetchMethod = initTableMethod
      if (initTableOperation) {
        // 给页面hook添加内容
        tempState.created.push({
          name: 'flows/tablePage/fetch',
          params: baseAction
        })
        tempState.destroyed.push({
          name: 'flows/hookFlow/destroyed',
          params: baseAction
        })

        // 给页面元素添加state
        tempState.card.title = initTableOperation.summary || ''
        const content = initTableOperation.responses[200].content
        const schema = getSchemaByContent(content)
        for (const prop in schema.properties) {
          const iprop = schema.properties[prop]
          if (otherInitContent.hiddenReadOnly && iprop.readOnly) continue
          const columnState: TableColumnState = {
            label: iprop.title,
            prop: prop
          }
          tempState.table?.columns?.push(columnState)
        }
        tempState.pagination = {
          currentPage: 1,
          pageSize: 10,
          total: 0,
          action: [{
            name: 'flows/tablePage/fetch',
            params: baseAction
          }]
        }
      }
    }

    return {
      data: this.inputs.data,
      state: tempState,
      baseAction: baseAction
    }
  }
}
