import { FunctionNode } from 'arkfbp/lib/functionNode'
import OpenAPI, { ISchema } from '@/config/openapi'
import TableColumnState from '@/admin/common/data/Table/TableColumn/TableColumnState'
import getSchemaByContent from '@/utils/get-schema-by-content'

export class InitTable extends FunctionNode {
  async run() {
    const tempState = this.inputs.state
    const { initContent, ...otherInitContent } = this.inputs.data
    if (initContent?.init?.path) {
      const initTablePath = initContent.init.path as string
      const initTableMethod = initContent.init.method as string || 'GET'
      const initTableOperation = OpenAPI.instance.getOperation(initTablePath, initTableMethod)
      if (initTableOperation) {
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
        
        // 根据返回值来判定应该给fetch怎样的数据映射关系 -- 可以根据OpenAPI的内容进行调整
        const type = Object.keys(content)[0]
        const responseSchema = content[type].schema
        let ref = responseSchema.$ref as string
        if (responseSchema.items) { ref = (responseSchema.items as ISchema).$ref as string }
        const responseData = OpenAPI.instance.getSchemaByRef(ref)
        // table的数据映射
        let responseMapping = {
          'table.data': ''
        }
        if (responseData.properties?.results) {
          responseMapping['table.data'] = 'results'
        } else if (responseData.properties?.data) {
          responseMapping['table.data'] = 'data'
        }
        // 有分页内容
        if (responseData.properties?.count) {
          responseMapping['pagination.total'] = 'count'
          tempState.pagination = {
            currentPage: 1,
            pageSize: 10,
            total: 0,
            action: 'fetch'
          }
        }
        // 给页面添加初始化事件流
        if (otherInitContent.isHooks !== false) {
          tempState.destroyed = 'destroyed'
          // 相对应给 actions 添加相同名称的 flow-config
          tempState.actions?.created.push('fetch')
          tempState.actions['fetch'] = [
            {
              name: 'arkfbp/flows/fetch',
              url: initTablePath,
              method: initTableMethod,
              response: responseMapping
            }
          ]
          tempState.actions['destroyed'] = [
            {
              name: 'flows/hookFlow/destroyed',
              url: initTablePath,
              method: initTableMethod
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
