import { APINode } from '@/arkfbp/nodes/apiNode'
import { ConfigModule } from '@/store/modules/config'
import { TenantModule } from '@/store/modules/tenant'

export class UpdatePasswordComplexify extends APINode {
  async run() {
    this.url = `/api/v1/config/current_password_complexity/?tenant=${TenantModule.currentTenant.uuid}`
    this.method = 'GET'
    const data = await super.run()
    ConfigModule.setPasswordComplexify(data)
  }
}