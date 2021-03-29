import { FunctionNode } from 'arkfbp/lib/functionNode'
import OpenAPI from '@/config/openapi'
import DialogState from '@/admin/common/Others/Dialog/DialogState'
import generateDialogForm from '@/utils/generate-dialog-form'
import getSchemaByContent from '@/utils/get-schema-by-content' 
import whetherImportListDialog from '@/utils/list-dialog'

export class InitTreeNodeSlot extends FunctionNode {
  async run() {
    const tempState = this.inputs.state
    const initContent = this.inputs.data.initContent
    // 设置添加节点的功能
    if (initContent.treeCreate && initContent.treeUpdate) {
      const treeListOperationPath = initContent.treeList.path
      const treeListOperationMethod = initContent.treeList.method
      const treeCreateNodeOperationPath = initContent.treeCreate.path
      const treeCreateNodeOperationMethod = initContent.treeCreate.method
      const treeCreateNodeOperation = OpenAPI.instance.getOperation(treeCreateNodeOperationPath, treeCreateNodeOperationMethod)
      const treeUpdateNodeOperationPath = initContent.treeUpdate.path
      const treeUpdateNodeOperationMethod = initContent.treeUpdate.method
      const treeUpdateNodeOperation = OpenAPI.instance.getOperation(treeUpdateNodeOperationPath, treeUpdateNodeOperationMethod)
      const treeDeleteNodeOperationPath = initContent.treeDelete.path
      const treeDeleteNodeOperationMethod = initContent.treeDelete.method
      const treeDeleteNodeOperation = OpenAPI.instance.getOperation(treeDeleteNodeOperationPath, treeDeleteNodeOperationMethod)
      
      // 定义 slot 插槽内容为 ButtonArray
      tempState.tree.nodes['slot'] = {
        buttons: {
          type: 'ButtonArray',
          state: []
        }
      }

      // 给每一个tree节点添加创建按钮
      if (treeCreateNodeOperation) {
        const addTreeNodeSlot = {
          label: treeCreateNodeOperation.summary || '添加',
          type: 'text',
          action: [
            {
              name: 'flows/treePage/openAddTreeNodeDialog',
            }
          ]
        }
        tempState.tree.nodes['slot'].buttons.state.push(addTreeNodeSlot)
      }

      // 给每一个tree节点添加编辑按钮
      if (treeUpdateNodeOperation) {
        const editTreeNodeSlot = {
          label: treeUpdateNodeOperation.summary || '编辑',
          type: 'text',
          action: [
            {
              name: 'flows/treePage/openEditTreeNodeDialog',
              params: {
                updateUrl: treeUpdateNodeOperationPath,
                updateMethod: treeUpdateNodeOperationMethod,
                fetchUrl: treeListOperationPath,
                fetchMethod: treeListOperationMethod,
              }
            }
          ]
        }
        tempState.tree.nodes['slot'].buttons.state.push(editTreeNodeSlot)
        // 编辑按钮对应的dialog
        const content = treeUpdateNodeOperation.requestBody.content
        const schema = getSchemaByContent(content)
        const editTreeNodeDialogState:DialogState = {}
        editTreeNodeDialogState.title = treeUpdateNodeOperation.summary || '编辑'
        editTreeNodeDialogState.visible = false
        editTreeNodeDialogState.data = {}
        editTreeNodeDialogState.actions = [
          {
            label: treeUpdateNodeOperation.summary || '编辑',
            action: [
              {
                name: 'flows/treePage/editTreeNode',
                params: {
                  updateUrl: treeUpdateNodeOperationPath,
                  updateMethod: treeUpdateNodeOperationMethod,
                  fetchUrl: treeListOperationPath,
                  fetchMethod: treeListOperationMethod,
                }
              }
            ],
            type: 'primary'
          }
        ]
        editTreeNodeDialogState.type = 'FormPage'
        editTreeNodeDialogState.state = generateDialogForm(schema, false)
        tempState.dialogs['editTreeNode'] = editTreeNodeDialogState

        // 在这里进行是否有 InputList 第二层弹出框的判断，如果有，进行初始化 selected 弹出框， 没有则跳过此步骤
        const importListDialog = whetherImportListDialog(editTreeNodeDialogState.state)
        if (importListDialog && !tempState.dialogs.selected) {
          tempState.dialogs['selected'] = importListDialog
        }

      }

      // 给每一个tree节点添加删除按钮
      if (treeDeleteNodeOperation) {
        const deleteTreeNodeSlot = {
          label: treeDeleteNodeOperation.summary || '删除',
          type: 'text',
          action: [
            {
              name: 'flows/treePage/deleteTreeNode',
              params: {
                deleteUrl: treeDeleteNodeOperationPath,
                deleteMethod: treeDeleteNodeOperationMethod,
                fetchUrl: treeListOperationPath,
                fetchMethod: treeListOperationMethod,
              }
            }
          ]
        }
        tempState.tree.nodes['slot'].buttons.state.push(deleteTreeNodeSlot)
      }
    }
    return {
      data: this.inputs.data,
      state: tempState,
    }
  }
}
