import { TokenAPINode } from '@/arkfbp/nodes/tokenAPINode'
import getUrl from '@/utils/get-url'

export class Fetch extends TokenAPINode {
  async run() {
    const tempState = location.pathname === '/tenant' ? this.inputs.com.$store.state.tenant.tenantState : this.inputs.com.$store.state.admin.adminState

    this.url = getUrl(this.inputs.params.fetchUrl)
    this.method = this.inputs.params.fetchMethod || 'get'
    if (!this.url) {
      throw Error('treePage fetchTreeNode flow is not url')
    }
    
    this.$state.commit((state: any) => {
      state.client = tempState
      state.params = this.inputs.params
    })
    const outputs = await super.run()
    return outputs
  }
}
