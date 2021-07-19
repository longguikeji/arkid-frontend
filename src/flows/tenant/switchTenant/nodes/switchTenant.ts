import { Jump } from '@/arkfbp/flows/jump/nodes/jump'
import { TenantModule } from '@/store/modules/tenant'
import { TablePage } from '@/admin/TablePage/TablePageState'
import { GlobalValueModule } from '@/store/modules/global-value'
import { addSlugToUrl } from '@/utils/url'

export class SwitchTenant extends Jump {
  async run() {
    const state: TablePage = this.inputs.client
    TenantModule.changeCurrentTenant(state.data)
    let target
    const slug = state.data.slug
    if (slug) {
      GlobalValueModule.setSlug(slug)
      addSlugToUrl(this.inputs.com)
      target = '/'
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
