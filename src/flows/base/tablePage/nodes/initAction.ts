import { FunctionNode } from 'arkfbp/lib/functionNode'
import TablePageState from '@/admin/TablePage/TablePageState'
import { generateDialog, cardButton, itemButton } from '@/utils/automation'

export class InitAction extends FunctionNode {
  async run() {
    let tempState: TablePageState = this.inputs.state
    const { initContent } = this.inputs.data
    // action 有两种UI类型 => page(页面) 和 item(table行元素)
    // ① 初始化page类型
    if (initContent?.page) {
      Object.keys(initContent.page).forEach(key => {
        const { path: url, method } = initContent.page[key]
        // card-button
        const btn = cardButton(tempState, url, method, key)
        tempState.card?.buttons?.push(btn)
        // dialogs
        generateDialog(tempState, url, method, key)
      })
    }
    // ② 初始化item类型
    if (initContent?.item) {
      Object.keys(initContent.item).forEach(key => {
        const action = initContent.item[key]
        let url = action.path || action.read.path
        let method = action.method || action.read.method
        // cloumn-buttons
        const btn = itemButton(tempState, url, method, key)
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
        // dialogs
        if (action.write) {
          url = action.write.path
          method = action.write.method
        }
        generateDialog(tempState, url, method, key)
      })
    }

    return {
      data: this.inputs.data,
      state: tempState
    }
  }
}
