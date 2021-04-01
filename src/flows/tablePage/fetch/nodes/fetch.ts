import { TokenAPINode } from '@/arkfbp/nodes/tokenAPINode'
import getUrl from '@/utils/get-url'

export class Fetch extends TokenAPINode {
  async run() {
    const tempState = location.pathname === '/tenant' ? this.inputs.com.$store.state.tenant.tenantState : this.inputs.com.$store.state.admin.adminState
    this.url = getUrl(this.inputs.params.fetchUrl)
    this.method = this.inputs.params.fetchMethod || 'get'
    this.params = {
      page: tempState.pagination.currentPage || 1,
      page_size: tempState.pagination.pageSize || 10
    }

    this.$state.commit((state: any) => {
      state.client = tempState
    })
    
    const outputs = await super.run()
    return outputs
  }
}
