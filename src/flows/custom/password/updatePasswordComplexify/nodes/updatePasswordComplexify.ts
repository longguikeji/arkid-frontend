import { AuthApiNode } from '@/arkfbp/nodes/authApiNode'
import { ConfigModule } from '@/store/modules/config'
import { TenantModule } from '@/store/modules/tenant'

export class UpdatePasswordComplexify extends AuthApiNode {
  async run() {
    this.url = `/api/v1/tenant/${TenantModule.currentTenant.uuid}/current_password_complexity/`
    this.method = 'GET'
    const data = await super.run()
    ConfigModule.setPasswordComplexify(data)
  }
}