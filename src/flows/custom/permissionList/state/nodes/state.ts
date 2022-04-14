import { FunctionNode } from 'arkfbp/lib/functionNode'

export class ChangePermissionListStateNode extends FunctionNode {
  async run() {
    // 页面
    const { state, page } = this.inputs
    const pageState = state[page].state

    // 修改table表格的actions的渲染拦截
    // 如果该行的is_system_permission字段值为true, 则actions设置为无
    const columns = pageState?.table?.columns
    if (!columns) return
    const actionColumn = columns.find((column) => column.prop === 'actions')
    actionColumn.getCellVisible = function(data: any = null) {
      return data && data.is_system_permission !== true
    }
  }
}
