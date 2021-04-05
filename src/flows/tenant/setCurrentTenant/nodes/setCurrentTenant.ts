import { TokenAPINode } from '@/arkfbp/nodes/tokenAPINode'
import { TenantModule } from '@/store/modules/tenant'
import LoginStore from '@/login/store/login'

export class SetCurrentTenant extends TokenAPINode {
  async run() {
    const tenantUUId = LoginStore.TenantUUID || TenantModule.currentTenant.uuid || this.inputs.route.query.tenant
    this.url = '/api/v1/tenant/'
    this.method = 'get'
    const outputs = await super.run()
    if (tenantUUId) {
      outputs.results.forEach(output => {
        if (output.uuid === tenantUUId) {
          TenantModule.changeCurrentTenant({...output})
        }
      })
    } else {
      const path = location.hash
      if (path === '#/login') {
        this.inputs.router.push('/login')
      } else {
        this.inputs.router.push('/tenant')
      }
    } 
  }
}
