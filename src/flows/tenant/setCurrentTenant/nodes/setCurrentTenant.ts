import { AuthApiNode } from '@/nodes/authApiNode'
import { TenantModule } from '@/store/modules/tenant'
import LoginStore from '@/login/store/login'

export class SetCurrentTenant extends AuthApiNode {
  async run() {
    const tenantUUId = LoginStore.TenantUUID || TenantModule.currentTenant.uuid || this.inputs.route.query.tenant || location.hash.split('=')[1]
    this.url = '/api/v1/tenant/'
    this.method = 'get'
    const outputs = await super.run()
    if (tenantUUId) {
      outputs.results.forEach(output => {
        if (output.uuid === tenantUUId) {
          TenantModule.changeCurrentTenant({...output})
        }
      })
    } 
  }
}
