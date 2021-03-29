import { FunctionNode } from 'arkfbp/lib/functionNode'
import OpenAPI from '@/config/openapi'
import DialogState from '@/admin/common/Others/Dialog/DialogState'
import generateDialogForm from '@/utils/generate-dialog-form'
import getSchemaByContent from '@/utils/get-schema-by-content'
import whetherImportListDialog from '@/utils/list-dialog'

export class InitAddTreeNode extends FunctionNode {
  async run() {
    const tempState = this.inputs.state
    const initContent = this.inputs.data.initContent
    // 设置添加节点的功能
    if (initContent.treeCreate) {
      const treeCreateNodeOperationPath = initContent.treeCreate.path
      const treeCreateNodeOperationMethod = initContent.treeCreate.method
      const treeListOperationPath = initContent.treeList.path
      const treeListOperationMethod = initContent.treeList.method
      const treeCreateNodeOperation = OpenAPI.instance.getOperation(treeCreateNodeOperationPath, treeCreateNodeOperationMethod)
      if (treeCreateNodeOperation) {
        // 添加相对应的弹出框内容
        const content = treeCreateNodeOperation.requestBody.content
        const schema = getSchemaByContent(content)
        const addTreeNodeDialogState:DialogState = {}
        addTreeNodeDialogState.title = treeCreateNodeOperation.summary || '新建节点'
        addTreeNodeDialogState.visible = false
        addTreeNodeDialogState.data = {}
        addTreeNodeDialogState.actions = [
          {
            label: treeCreateNodeOperation.summary || '新建节点',
            action: [
              {
                name: 'flows/treePage/addTreeNode',
                params: {
                  createUrl: treeCreateNodeOperationPath,
                  createMethod: treeCreateNodeOperationMethod,
                  fetchUrl: treeListOperationPath,
                  fetchMethod: treeListOperationMethod,
                }
              }
            ],
            type: 'primary'
          }
        ]
        addTreeNodeDialogState.type = 'FormPage'
        addTreeNodeDialogState.state = generateDialogForm(schema, false)
        tempState.dialogs['addTreeNode'] = addTreeNodeDialogState

        // 在这里进行是否有 InputList 第二层弹出框的判断，如果有，进行初始化 selected 弹出框， 没有则跳过此步骤
        const importListDialog = whetherImportListDialog(addTreeNodeDialogState.state)
        if (importListDialog && !tempState.dialogs.selected) {
          tempState.dialogs['selected'] = importListDialog
        }
      
        // 给tree结构顶层添加创建树节点按钮和事件流
        // 在该事件中，打算添加的节点可以添加到任意一个已存在节点的同级或者下级中去
        tempState.tree.header.buttons = [
          {
            label: treeCreateNodeOperation.summary || '添加',
            action: [
              {
                name: 'flows/treePage/openAddTreeNodeDialog'
              }
            ],
            type: 'primary',
            size: 'small'
          }
        ]
      }
    }
    return {
      data: this.inputs.data,
      state: tempState,
    }
  }
}
