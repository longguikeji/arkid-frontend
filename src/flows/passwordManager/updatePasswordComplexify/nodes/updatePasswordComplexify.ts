import { AuthApiNode } from '@/arkfbp/nodes/authApiNode'
import { GlobalValueModule } from '@/store/modules/global-value'
import { TenantModule } from '@/store/modules/tenant'

export class UpdatePasswordComplexify extends AuthApiNode {
  async run() {
    this.url = `/api/v1/tenant/${TenantModule.currentTenant.uuid}/current_password_complexity/`
    this.method = 'GET'
    const data = await super.run()
    GlobalValueModule.setPasswordComplexify(data)
  }
}