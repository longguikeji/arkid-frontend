import { FunctionNode } from 'arkfbp/lib/functionNode'
import { TreePage } from '@/admin/TreePage/TreePageState'
import { generateDialog, cardButton, itemButton } from '@/utils/automation'

export class InitAction extends FunctionNode {
  async run() {
    let tempState: TreePage = this.inputs.state
    const { initContent } = this.inputs.data
    const showReadOnly = false
    
    // 对树进行操作
    if (initContent.page) {
      Object.keys(initContent.page).forEach(key => {
        const { path: url, method } = initContent.page[key]
        tempState = generateDialog(tempState, url, method, key, showReadOnly)
        const btn = cardButton(tempState, url, method, key)
        tempState.card?.buttons?.push(btn)
      })
    }

    // 对节点进行操作
    if (initContent.item) {
      // 先给item添加插槽内容
      tempState.tree!['slot'] = {
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
          tempState = generateDialog(tempState, url, method, key, showReadOnly)
          // 按钮
          if (action.read) {
            url = action.read.path
            method = action.read.method
          }
          const isTextType = true
          const btn = itemButton(tempState, url, method, key, isTextType)
          tempState.tree!['slot'].buttons.state.push(btn)
        }
      })
    }

    const { state } = this.$state.fetch()

    return {
      data: this.inputs.data,
      state: state
    }
  }
}
