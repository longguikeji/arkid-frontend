import { FunctionNode } from 'arkfbp/lib/functionNode'
import OpenAPI from '@/config/openapi'
import DialogState from '@/admin/common/Others/Dialog/DialogState'
import generateDialogForm from '@/utils/generate-dialog-form'
import getSchemaByContent from '@/utils/get-schema-by-content'
import TablePageState from '@/admin/TablePage/TablePageState'
import whetherImportListDialog from '@/utils/list-dialog'

export class InitUpdate extends FunctionNode {
  async run() {
    const tempState = this.inputs.state as TablePageState
    const initContent = this.inputs.data.initContent
    if (initContent.update) {
      const listOperationPath = initContent.list.path
      const listOperationMethod = initContent.list.method
      const updateOperationPath = initContent.update.path
      const updateOperationMethod = initContent.update.method
      const updateOperation = OpenAPI.instance.getOperation(updateOperationPath, updateOperationMethod)
      if (updateOperation) {
        // button
        const columnUpdate = {
          prop: 'action',
          label: '操作',
          scope: {
            type: 'ButtonArray',
            state: [
              {
                label: updateOperation.summary || '编辑',
                type: 'primary',
                action: [
                  {
                    name: 'flows/tablePage/openUpdateDialog',
                    params: {
                      updateUrl: updateOperationPath,
                      updateMethod: 'get'
                    }
                  }
                ]
              }
            ]
          }
        }
        tempState.table?.columns?.push(columnUpdate)
        // dialog
        const content = updateOperation.requestBody.content
        const schema = getSchemaByContent(content)
        const updateDialogState:DialogState = {}
        updateDialogState.title = updateOperation.summary || '编辑'
        updateDialogState.visible = false
        updateDialogState.data = {}
        updateDialogState.actions = [
          {
            label: updateOperation.summary || '确定',
            action: [
              {
                name: 'flows/tablePage/update',
                params: {
                  updateUrl: updateOperationPath,
                  updateMethod: updateOperationMethod,
                  fetchUrl: listOperationPath,
                  fetchMethod: listOperationMethod
                }
              }
            ],
            type: 'primary'
          }
        ]
        updateDialogState.type = 'FormPage'
        updateDialogState.state = generateDialogForm(schema)
        tempState.dialogs!.update = updateDialogState

        // 在这里进行是否有 InputList 第二层弹出框的判断，如果有，进行初始化 selected 弹出框， 没有则跳过此步骤
        const importListDialog = whetherImportListDialog(updateDialogState.state)
        if (importListDialog && !tempState.dialogs!.selected) {
          tempState.dialogs!.selected = importListDialog
        }

      }
    }
    return {
      data: this.inputs.data,
      state: tempState
    }
  }
}
