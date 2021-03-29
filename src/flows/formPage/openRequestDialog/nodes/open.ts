import { FunctionNode } from 'arkfbp/lib/functionNode'

export class OpenRequestDialog extends FunctionNode {
  async run() {
    const tempState = location.pathname === '/tenant' ? this.inputs.com.$store.state.tenant.tenantState : this.inputs.com.$store.state.admin.adminState
    if (tempState && tempState.dialogs) {
      tempState.dialogs.request.visible = true
      // 初始化表单每一项的值 todo...
    }
  }
}
