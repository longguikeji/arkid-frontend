import { FunctionNode } from 'arkfbp/lib/functionNode'
import { TenantModule } from '@/store/modules/tenant'

export class OpenAuthPage extends FunctionNode {
  async run() {
    const com = this.inputs.com
    const router = com.$router
    const data = com.state.data
    const { href } = router.resolve({
      name: 'auth',
      query: {
        tenant: TenantModule.currentTenant.uuid,
        app: data.uuid
      }
    })
    window.open(href, '_blank')
  }
}
