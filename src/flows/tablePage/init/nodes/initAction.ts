import { FunctionNode } from 'arkfbp/lib/functionNode'
import TablePageState from '@/admin/TablePage/TablePageState'
import { dialog, cardButton, itemButton } from '@/utils/initpage'

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
        const btn = cardButton(url, method, key, prefix)
        tempState.card?.buttons?.push(btn)
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
        const btn = itemButton(url, method, key, prefix, baseAction)
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
          tempState.table?.columns![len]?.scope?.state?.push(btn)
        }
        tempState.table?.columns![len - 1]?.scope?.state?.push(btn)
      })
    }

    return {
      data: this.inputs.data,
      state: tempState,
      baseAction: this.inputs.baseAction
    }
  }
}
