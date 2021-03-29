import { TokenAPINode } from '@/arkfbp/nodes/tokenAPINode'
import getUrl from '@/utils/get-url'

export class Fetch extends TokenAPINode {
  async run() {
    const url = this.inputs.params.tableUrl
    this.url = getUrl(url)
    this.method = this.inputs.params.tableMethod || 'get'
    const tempState = location.pathname === '/tenant' ? this.inputs.com.$store.state.tenant.tenantState : this.inputs.com.$store.state.admin.adminState
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
