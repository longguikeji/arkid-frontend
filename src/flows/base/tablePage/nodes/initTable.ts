import { FunctionNode } from 'arkfbp/lib/functionNode'
import OpenAPI from '@/config/openapi'
import TableColumnState from '@/admin/common/data/Table/TableColumn/TableColumnState'
import getSchemaByContent from '@/utils/get-schema-by-content'

export class InitTable extends FunctionNode {
  async run() {
    const tempState = this.inputs.state
    const { initContent, ...otherInitContent } = this.inputs.data
    let baseAction = {
      url: '',
      method: ''
    }
    if (initContent?.init?.path) {
      const initTablePath = initContent.init.path as string
      const initTableMethod = initContent.init.method as string || 'GET'
      const initTableOperation = OpenAPI.instance.getOperation(initTablePath, initTableMethod)
      baseAction.url = initTablePath
      baseAction.method = initTableMethod
      if (initTableOperation) {
        // 给页面hook添加内容
        if (otherInitContent.isHooks !== false) {
          tempState.destroyed = 'destroyed'
          // 相对应给 actions 添加相同名称的 flow-config
          tempState.actions?.created.push('fetch')
          tempState.actions['fetch'] = [
            {
              name: 'arkfbp/flows/fetch',
              url: baseAction.url,
              method: baseAction.method,
              response: {
                'table.data': 'data'
              }
            }
          ]
          tempState.actions['destroyed'] = [
            {
              name: 'flows/hookFlow/destroyed',
              url: baseAction.url,
              method: baseAction.method
            }
          ]
        }

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
          action: 'fetch'
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
