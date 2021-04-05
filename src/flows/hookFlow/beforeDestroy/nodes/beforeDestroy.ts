import { isTenantState } from '@/utils/get-page-state'
import { FunctionNode } from 'arkfbp/lib/functionNode'

export class BeforeDestroy extends FunctionNode {
  async run() {
    // beforeDestory one page
    const tempState = isTenantState() ? this.inputs.com.$store.state.tenant.tenantState : this.inputs.com.$store.state.admin.adminState
    if (tempState) {
      const path = this.inputs.com.path
      tempState.pages.splice(tempState.pages.indexOf(path), 1)
    }
  }
}
