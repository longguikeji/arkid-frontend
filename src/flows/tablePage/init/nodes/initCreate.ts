import { FunctionNode } from 'arkfbp/lib/functionNode'
import OpenAPI from '@/config/openapi'
import DialogState from '@/admin/common/Others/Dialog/DialogState'
import generateDialogForm from '@/utils/generate-dialog-form'
import getSchemaByContent from '@/utils/get-schema-by-content'
import whetherImportListDialog from '@/utils/list-dialog'
import TablePageState from '@/admin/TablePage/TablePageState'

export class InitCreate extends FunctionNode {
  async run() {
    const tempState = this.inputs.state as TablePageState
    const initContent = this.inputs.data.initContent
    if (initContent.create) {
      const listOperationPath = initContent.list.path
      const listOperationMethod = initContent.list.method
      const createOperationPath = initContent.create.path
      const createOperationMethod = initContent.create.method
      const createOperation = OpenAPI.instance.getOperation(createOperationPath, createOperationMethod)
      if (createOperation) {
        const content = createOperation.requestBody.content
        const schema = getSchemaByContent(content)
        const createDialogState:DialogState = {}
        createDialogState.title = createOperation.summary || '创建'
        createDialogState.visible = false
        createDialogState.data = {}
        createDialogState.actions = [
          {
            label: createOperation.summary || '创建',
            action: [
              {
                name: 'flows/tablePage/create',
                params: {
                  createUrl: createOperationPath,
                  createMethod: createOperationMethod,
                  fetchUrl: listOperationPath,
                  fetchMethod: listOperationMethod
                }
              }
            ],
            type: 'primary'
          }
        ]
        // const tempItems: Array<FormItemState> = generateDialogForm(schema, false)
        createDialogState.type = 'FormPage'
        createDialogState.state = generateDialogForm(schema, false)

        // 在这里进行是否有 InputList 第二层弹出框的判断，如果有，进行初始化 selected 弹出框， 没有则跳过此步骤
        const importListDialog = whetherImportListDialog(createDialogState.state)
        if (importListDialog && !tempState.dialogs!.selected) {
          tempState.dialogs!.selected = importListDialog
        }

        tempState.dialogs!.create = createDialogState
        const createButton = {
          label: createOperation.summary || '创建',
          action: [
            {
              name: 'flows/tablePage/openCreateDialog'
            }
          ],
          type: 'primary'
        }
        tempState.card?.buttons?.push(createButton)
      }
    }
    this.$state.commit((state) => {
      state.tempState = tempState
    })
    return {
      data: this.inputs.data,
      state: tempState
    }
  }
}
