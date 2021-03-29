import { TokenAPINode } from '@/arkfbp/nodes/tokenAPINode'
import getUrl from '@/utils/get-url'

export class Fetch extends TokenAPINode {

  async run() {
    const url = this.inputs.params.fetchUrl
    if (!url) {
      throw Error('fetch flow is not url')
    }
    this.url = getUrl(url)
    this.method = this.inputs.params.fetchMethod || 'get'
    const tempState = location.pathname === '/tenant' ? this.inputs.com.$store.state.tenant.tenantState : this.inputs.com.$store.state.admin.adminState
    this.$state.commit((state: any) => {
      state.client = tempState
      state.params = this.inputs.params
    })
    const outputs = await super.run()
    return outputs
  }

}
