import { FunctionNode } from 'arkfbp/lib/functionNode'
import { TablePage } from '@/admin/TablePage/TablePageState'
import { generateDialog, cardButton, itemButton } from '@/utils/automation'

export class InitAction extends FunctionNode {
  async run() {
    const { state, initContent } = this.inputs
    const tempState: TablePage = state.state
    // if (initContent?.page) {
    //   Object.keys(initContent.page).forEach(key => {
    //     const { path, method } = initContent.page[key]
    //     Action.generateAction(state, path, method, key)
    //   })
    // }

    // action 有两种UI类型 => page(页面) 和 item(table行元素)
    // ① 初始化page类型
    if (initContent?.page) {
      Object.keys(initContent.page).forEach(key => {
        const { path: url, method } = initContent.page[key]
        // dialogs
        generateDialog(tempState, url, method, key)
        // card-button
        const btn = cardButton(tempState, url, method, key)
        tempState.card?.buttons?.push(btn)
      })
    }
    // ② 初始化item类型
    if (initContent?.item) {
      Object.keys(initContent.item).forEach(key => {
        const action = initContent.item[key]
        let url = action.path || action.write.path
        let method = action.method || action.write.method
        // dialogs
        generateDialog(tempState, url, method, key)
        // cloumn-buttons
        if (action.read) {
          url = action.read.path
          method = action.read.method
        }
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
      })
    }

    return this.inputs
  }
}
