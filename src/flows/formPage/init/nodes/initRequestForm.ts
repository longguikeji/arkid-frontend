import { FunctionNode } from 'arkfbp/lib/functionNode'
import OpenAPI from '@/config/openapi'
import getSchemaByContent from '@/utils/get-schema-by-content'

export class InitRequestForm extends FunctionNode {
  async run() {
    const tempState = this.inputs.state
    const initContent = this.inputs.data.initContent
    const hasReadOnlyFunction = this.inputs.hasReadOnlyFunction || false
    if (initContent.request) {
      const formRequestOperationPath = initContent.request.path
      const formRequestOperationMethod = initContent.request.method
      const formRequestOperation = OpenAPI.instance.getOperation(formRequestOperationPath, formRequestOperationMethod)
      // 如果存在 formRequestOperation ，也就说明该表单页面有请求更新表单数据的功能
      // 所以如果存在 formRequestOperation ，那么下一步就是对 FormPage 中的 dialogs 对话框进行生成
      if (formRequestOperation) {
        if (hasReadOnlyFunction) {
          // 对话框
          tempState.dialogs['request'] = {
            title: formRequestOperation.summary || '',
            visible: false,
            state: {
              form: {
                items: {},
                buttons: []
              }
            },
            actions: [
              {
                label: formRequestOperation.summary || '',
                type: 'primary',
                action: [
                  {
                    name: 'flows/formPage/request',
                    params: {
                      url: formRequestOperationPath,
                      method: formRequestOperationMethod,
                      type: 'dialog'
                    }
                  }
                ]
              }
            ]
          }
        } 
        // 对 table 进行初始化操作
        const content = formRequestOperation.requestBody.content
        const schema = getSchemaByContent(content)
        for (const prop in schema.properties) {
          const iprop = schema.properties[prop]
          if (iprop.type === 'string') {
            const item = {
              type: 'Input',
              label: iprop.title,
              prop: prop,
              required: schema.required?.includes(prop),
              showMessage: false,
              state: {
                value: ''
              }
            }
            if (hasReadOnlyFunction) {
              tempState.dialogs.request.state.form.items[prop] = item
            } else {
              tempState.form.items[prop] = item
            }
          }
        }
        // form表单底部的按钮
        const buttons = [
          {
            label: formRequestOperation.summary || '',
            type: 'primary',
            action: [
              {
                name: hasReadOnlyFunction ? "flows/formPage/openRequestDialog" : "flows/formPage/request",
                params: hasReadOnlyFunction ? {} : {
                  url: formRequestOperationPath,
                  method: formRequestOperationMethod,
                  type: 'form'
                }
              }
            ]
          }
        ]
        tempState.buttons = buttons
      }
    }
    return {
      data: this.inputs.data,
      state: tempState,
    }
  }
}
