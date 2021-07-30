import { Jump } from '@/arkfbp/flows/jump/nodes/jump'
import { TenantModule } from '@/store/modules/tenant'
import { TablePage } from '@/admin/TablePage/TablePageState'
import { addSlugToUrl } from '@/utils/url'
import { FlowModule } from '@/store/modules/flow'

export class SwitchTenant extends Jump {
  async run() {
    const state: TablePage = this.inputs.client
    const data = FlowModule.data
    const depData = data[state.name!.split('.')[0]]
    TenantModule.changeCurrentTenant(depData)
    let target
    const slug = depData.slug
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
