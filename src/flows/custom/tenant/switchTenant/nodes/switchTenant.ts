import { FunctionNode } from 'arkfbp/lib/functionNode'
import { switchTenantBySlug, switchTenantByUUID } from '@/utils/url'
import { FlowModule } from '@/store/modules/flow'

export class SwitchTenant extends FunctionNode {
  async run() {
    const data = FlowModule.data
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
