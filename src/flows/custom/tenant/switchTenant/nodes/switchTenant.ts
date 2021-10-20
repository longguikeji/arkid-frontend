import { FunctionNode } from 'arkfbp/lib/functionNode'
import { switchTenantBySlug, switchTenantByUUID } from '@/utils/url'

export class SwitchTenant extends FunctionNode {
  async run() {
    const { com } = this.inputs
    const data = com.state.data
    const tenant = data['tenant']
    if (tenant) {
      const { slug, use_slug } = tenant
      if (slug && use_slug) {
        switchTenantBySlug(tenant)
      } else {
        switchTenantByUUID(tenant)
      }
    }
  }
}
