import { FunctionNode } from 'arkfbp/lib/functionNode'

export class ChangePermissionGroupStateNode extends FunctionNode {
  async run() {
    // 页面
    const { state, page } = this.inputs
    const pageState = state[page].state

    // 修改tree的slot的渲染拦截
    // 如果该行的is_system_group字段值为true, 则隐藏slot
    const tree = pageState?.tree
    if (!tree) return
    tree.getSlotVisible = (data: any = null) => {
      return data && data.is_system_group !== true
    }
  }
}
