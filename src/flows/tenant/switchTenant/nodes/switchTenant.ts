import { Jump } from '@/arkfbp/flows/jump/nodes/jump'
import { TenantModule } from '@/store/modules/tenant'
import { TablePage } from '@/admin/TablePage/TablePageState'
import { GlobalValueModule } from '@/store/modules/global-value'
import { getToken } from '@/utils/auth'
import getBaseUrl from '@/utils/get-base-url'

export class SwitchTenant extends Jump {
  async run() {
    const tenantState: TablePage = this.inputs.client
    const data: any = tenantState.dialogs?.switch.data
    TenantModule.changeCurrentTenant(data)
    let target
    const slug = data.slug
    if (slug) {
      GlobalValueModule.setSlug(slug)
      const host = GlobalValueModule.originUrl
      const newHost = host?.replace(window.location.protocol + '//', window.location.protocol + '//' + slug + '.')
      const url = newHost + '/' + getBaseUrl() + '?token=' + getToken()
      window.location.replace(url)
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
