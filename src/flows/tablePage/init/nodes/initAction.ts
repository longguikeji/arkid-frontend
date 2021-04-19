import { FunctionNode } from 'arkfbp/lib/functionNode'
import { ITagPageAction, ITagInitUpdateAction, ITagInitAction } from '@/config/openapi'
import DialogState from '@/admin/common/Others/Dialog/DialogState'
import whetherImportListDialog from '@/utils/list-dialog'
import TablePageState from '@/admin/TablePage/TablePageState'
import { GenerateDialogStateParams, generateDialogState } from '@/utils/dialog'

export class InitAction extends FunctionNode {

  initBaseAttributes(key: string) {
    let title = '', dialogType = 'FormPage', buttonType = 'primary'
    switch (key) {
      case 'create':
        title = '创建'
        break
      case 'import':
        title = '导入'
        break
      case 'export':
        title = '导出'
        break
      case 'update':
        title = '编辑'
        break
      case 'delete':
        title = '删除'
        buttonType = 'danger'
        break
      case 'retrieve':
        title = '查看'
        buttonType = 'info'
        break
    }
    return {
      title: title,
      dialogType: dialogType,
      buttonType: buttonType
    }
  }

  getNewKey(key: string) {
    return key.slice(0,1).toUpperCase() + key.slice(1).toLowerCase()
  }

  initTablePageDialogState(tempState: TablePageState, url: string, method: string, key: string, title: string, buttonType: string, dialogType: string) {
    // 初始化对应的 dialog
    const dialogActions = [
      {
        label: title,
        type: buttonType,
        action: [
          {
            name: "flows/tablePage/" + key,
            params: {
              url,
              method,
              ...this.inputs.initBaseAction
            }
          }
        ]
      }
    ]
    const dialogParams: GenerateDialogStateParams = {
      path: url,
      method: method,
      type: dialogType,
      title: title,
      actions: dialogActions
    }
    const dialogState = generateDialogState(dialogParams)
    if (dialogState) {
      tempState.dialogs![key] = dialogState as DialogState
      const importListDialog = whetherImportListDialog(dialogState.state)
      if (importListDialog && !tempState.dialogs!.selected) {
        tempState.dialogs!.selected = importListDialog
      }
    }
  }

  async run() {
    const tempState: TablePageState = this.inputs.state
    const { initContent } = this.inputs.data
    // action 有两种UI类型 => page(页面) 和 item(table行元素)
    // ① 初始化page类型
    if (initContent?.page) {
      Object.keys(initContent.page).forEach(key => {
        const { title, dialogType, buttonType } = this.initBaseAttributes(key)
        const { path: url, method } = initContent.page[key]
        // 对话框
        this.initTablePageDialogState(tempState, url, method, key, title, buttonType, dialogType)
        // 按钮
        const newKey = this.getNewKey(key)
        const cardButton = {
          label: title,
          action: [
            {
              name: 'flows/tablePage/open' + newKey + 'Dialog'
            }
          ],
          type: buttonType,
        }
        tempState.card?.buttons?.push(cardButton)
      })
    }

    // ② 初始化item类型
    if (initContent?.item) {
      Object.keys(initContent.item).forEach(key => {
        const { title, dialogType, buttonType } = this.initBaseAttributes(key)
        let action = initContent.item[key]
        if (action.read) action = action.read
        const { path: url, method } = action
        // 对话框
        this.initTablePageDialogState(tempState, url, method, key, title, buttonType, dialogType)
        // 按钮
        const newKey = this.getNewKey(key)
        const buttonState = {
          label: title,
          type: buttonType,
          action: [
            {
              name: action.method === 'delete' ? 'flows/tablePage/delete' : 'flows/tablePage/open' + newKey + 'Dialog',
              params: {
                url,
                method,
                ...this.inputs.initBaseAction
              }
            }
          ]
        }
        const len = tempState.table?.columns?.length as number
        if (tempState.table!.columns![len-1].prop !== 'actions') {
          const columnUpdate = {
            prop: 'actions',
            label: '操作',
            scope: {
              type: 'ButtonArray',
              state: []
            }
          }
          tempState.table?.columns?.push(columnUpdate)
          tempState.table?.columns![len]?.scope?.state?.push(buttonState)
        }
        tempState.table?.columns![len - 1]?.scope?.state?.push(buttonState)
      })
    }

    return {
      data: this.inputs.data,
      state: tempState,
      initBaseAction: this.inputs.initBaseAction
    }
  }
}
