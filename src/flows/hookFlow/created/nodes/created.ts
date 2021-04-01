import { FunctionNode } from 'arkfbp/lib/functionNode'

export class Created extends FunctionNode {
  async run() {
    // add current page
    const tempState = location.pathname === '/tenant' ? this.inputs.com.$store.state.tenant.tenantState : this.inputs.com.$store.state.admin.adminState
    if (tempState) {
      const path = this.inputs.com.path
      tempState.pages.push(path)
    }
  }
}
