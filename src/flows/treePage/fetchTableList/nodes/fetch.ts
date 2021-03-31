import { TokenAPINode } from '@/arkfbp/nodes/tokenAPINode'
import getUrl from '@/utils/get-url'

export class Fetch extends TokenAPINode {
  async run() {
    const tempState = location.pathname === '/tenant' ? this.inputs.com.$store.state.tenant.tenantState : this.inputs.com.$store.state.admin.adminState
    
    this.url = getUrl(this.inputs.params.tableUrl)
    this.method = this.inputs.params.tableMethod || 'get'

    this.$state.commit((state: any) => {
      state.client = tempState
    })
    
    const outputs = await super.run()
    return {
      data: outputs,
      params: this.inputs.params,
    }
  }
}
