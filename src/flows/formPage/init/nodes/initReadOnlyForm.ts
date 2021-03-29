import { FunctionNode } from 'arkfbp/lib/functionNode'
import OpenAPI from '@/config/openapi'
import getSchemaByContent from '@/utils/get-schema-by-content'

export class InitReadOnlyForm extends FunctionNode {
  async run() {
    const tempState = this.inputs.state
    const initContent = this.inputs.data.initContent
    if (initContent.fetch) {
      const formFetchOperationPath = initContent.fetch.path
      const formFetchOperationMethod = initContent.fetch.method
      const formOperation = OpenAPI.instance.getOperation(formFetchOperationPath, formFetchOperationMethod)
      if (formOperation) {
        // 给 created 赋值
        tempState.created = [
          { 
            name: "flows/formPage/fetch",
            params: {
              fetchUrl: formFetchOperationPath,
              fetchMethod: formFetchOperationMethod
            }
          }
        ]
        // 给 title 进行赋值
        tempState.title = formOperation.summary || ''
        // 对 table 进行初始化操作
        const content = formOperation.responses[200].content
        const schema = getSchemaByContent(content)
        for (const prop in schema.properties) {
          const iprop = schema.properties[prop]
          if (iprop.type === 'string') {
            const item = {
              type: 'Input',
              label: iprop.title,
              prop: prop,
              state: {
                value: '',
                readonly: true
              }
            }
            tempState.form.items[prop] = item
          }
        }
      }
    }
    return {
      data: this.inputs.data,
      state: tempState,
      hasReadOnlyFunction: initContent.fetch ? true : false
    }
  }
}
