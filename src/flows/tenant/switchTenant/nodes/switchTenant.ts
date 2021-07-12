import { Jump } from '@/arkfbp/flows/jump/nodes/jump'
import { TenantModule } from '@/store/modules/tenant'
import { TablePage } from '@/admin/TablePage/TablePageState'
import { GlobalValueModule } from '@/store/modules/global-value'
import { addSlugToUrl } from '@/utils/url'

export class SwitchTenant extends Jump {
  async run() {
    const tenantState: TablePage = this.inputs.client
    const data: any = tenantState.dialogs?.switch.data
    TenantModule.changeCurrentTenant(data)
    let target
    const slug = data.slug
    if (slug) {
      GlobalValueModule.setSlug(slug)
      addSlugToUrl(this.inputs.com)
    } else {
      target = {
        path: '/',
        query: {
          tenant: TenantModule.currentTenant.uuid
        }
      }
    }
    this.inputs.target = target
    await super.run()
  }
}
