import { Jump } from '@/arkfbp/flows/jump/nodes/jump'
import { TenantModule } from '@/store/modules/tenant'
import { TablePage } from '@/admin/TablePage/TablePageState'
import { addSlugToUrl } from '@/utils/url'

export class SwitchTenant extends Jump {
  async run() {
    const state: TablePage = this.inputs.client
    TenantModule.changeCurrentTenant(state.data)
    let target
    const slug = state.data.slug
    if (slug) {
      addSlugToUrl(this.inputs.com, slug)
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
