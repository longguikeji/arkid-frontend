import { TokenAPINode } from '@/arkfbp/nodes/tokenAPINode'
import { runFlowByFile } from '@/arkfbp/index'
import getUrl from '@/utils/get-url'
import TablePageState from '@/admin/TablePage/TablePageState'

export class Sort extends TokenAPINode {
  async run() {
    const tempState: TablePageState = location.pathname === '/tenant' ? this.inputs.com.$store.state.tenant.tenantState : this.inputs.com.$store.state.admin.adminState
    const data = tempState.table?.data
    
    this.url = getUrl(this.inputs.params.sortUrl, data)
    this.method = this.inputs.params.sortMethod || 'post'
    if (!this.url) {
      throw Error('tablePage sort flow is not url')
    }
    
    this.params = {
      idps: []
    }
    if (data) {
      data.forEach(row => {
        this.params.idps.push(row.uuid)
      })
    }
    
    this.$state.commit((state: any) => {
      state.client = tempState
    })
    
    const outputs = await super.run()
    return outputs
  }
}
