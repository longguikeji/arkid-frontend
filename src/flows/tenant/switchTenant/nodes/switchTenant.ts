import { Jump } from '@/arkfbp/flows/jump/nodes/jump'
import { TenantModule } from '@/store/modules/tenant'
import TablePageState from '@/admin/TablePage/TablePageState'

export class SwitchTenant extends Jump {
  async run() {
    const tenantState: TablePageState = this.getState()
    const data: any = tenantState.dialogs?.switch.data
    TenantModule.changeCurrentTenant(data)
    let target
    const slug = data.slug
    if (slug && TenantModule.currentSlugIsValid) {
      let host = window.location.host.split('.')
      host.splice(0, 1, slug)
      let newHost = host.join('.')
      target = window.location.protocol + '//' + newHost + process.env.VUE_APP_BASE_API + '/'
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
