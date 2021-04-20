import { FunctionNode } from 'arkfbp/lib/functionNode'
import TreePageState from '@/admin/TreePage/TreePageState'
import { getBaseAttributes, dialog } from '@/utils/initpage'

export class InitAction extends FunctionNode {
  async run() {
    let tempState: TreePageState = this.inputs.state
    const { initContent } = this.inputs.data
    const baseAction = this.inputs.baseAction
    const prefix = 'flows/treePage/'
    const showReadOnly = false

    // 对树进行操作
    if (initContent.page) {
      Object.keys(initContent.page).forEach(key => {
        const { path: url, method } = initContent.page[key]
        tempState = dialog(tempState, url, method, key, prefix, baseAction, showReadOnly)
        const { title, buttonType, newKey } = getBaseAttributes(key)
        const cardButton = {
          label: title,
          action: [
            {
              name: 'flows/treePage/open' + newKey + 'Dialog'
            }
          ],
          type: buttonType,
        }
        tempState.tree?.header?.buttons?.push(cardButton)
      })
    }

    // 对节点进行操作
    if (initContent.item) {
      // 先给item添加插槽内容
      tempState.tree!.nodes!['slot'] = {
        buttons: {
          type: 'ButtonArray',
          state: []
        }
      }
      Object.keys(initContent.item).forEach(key => {
        if (key !== 'children') {
          const action = initContent.item[key]
          let url = action.path || action.write.path
          let method = action.method || action.write.method
          // 对话框
          tempState = dialog(tempState, url, method, key, prefix, baseAction, showReadOnly)
          // 按钮
          if (action.read) {
            url = action.read.path
            method = action.read.method
          }
          const { title, newKey } = getBaseAttributes(key)
          const buttonState = {
            label: title,
            type: 'text',
            action: [
              {
                name: action.method === 'delete' ? 'flows/treePage/delete' : 'flows/treePage/open' + newKey + 'Dialog',
                params: {
                  url,
                  method,
                  ...this.inputs.baseAction
                }
              }
            ]
          }
          tempState.tree?.nodes!['slot'].buttons.state.push(buttonState)
        }
      })
    }

    return {
      data: this.inputs.data,
      state: tempState,
      baseAction: baseAction
    }
  }
}
