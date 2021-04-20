import { FunctionNode } from 'arkfbp/lib/functionNode'
import TablePageState from '@/admin/TablePage/TablePageState'
import { getBaseAttributes, dialog } from '@/utils/initpage'

export class InitAction extends FunctionNode {

  async run() {
    let tempState: TablePageState = this.inputs.state
    const { initContent } = this.inputs.data
    const baseAction = this.inputs.baseAction
    const prefix = 'flows/tablePage/'
    // action 有两种UI类型 => page(页面) 和 item(table行元素)
    // ① 初始化page类型
    if (initContent.page) {
      Object.keys(initContent.page).forEach(key => {
        const { path: url, method } = initContent.page[key]
        // 对话框
        tempState = dialog(tempState, url, method, key, prefix, baseAction)
        // 按钮
        const { title, buttonType, newKey } = getBaseAttributes(key)
        const cardButton = {
          label: title,
          action: [
            {
              name: key !== 'export' ? 'flows/tablePage/open' + newKey + 'Dialog' : 'flows/tablePage/export',
              params: key !== 'export' ? {} : {
                url: url,
                method: method,
              }
            }
          ],
          type: buttonType,
        }
        tempState.card?.buttons?.push(cardButton)
      })
    }
    
    // ② 初始化item类型
    if (initContent.item) {
      Object.keys(initContent.item).forEach(key => {
        const action = initContent.item[key]
        let url = action.path || action.write.path
        let method = action.method || action.write.method
        // 对话框
        tempState = dialog(tempState, url, method, key, prefix, baseAction)
        // 按钮
        if (action.read) {
          url = action.read.path
          method = action.read.method
        }
        const { title, buttonType, newKey } = getBaseAttributes(key)
        const buttonState = {
          label: title,
          type: buttonType,
          action: [
            {
              name: action.method === 'delete' ? 'flows/tablePage/delete' : 'flows/tablePage/open' + newKey + 'Dialog',
              params: {
                url,
                method,
                ...this.inputs.baseAction
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
      baseAction: this.inputs.baseAction
    }
  }
}
