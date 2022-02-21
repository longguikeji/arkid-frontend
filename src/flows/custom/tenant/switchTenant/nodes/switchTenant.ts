import { FunctionNode } from 'arkfbp/lib/functionNode'
import { getToken } from '@/utils/auth'
import getBaseUrl from '@/utils/get-base-url'
import { ConfigModule } from '@/store/modules/config'
import { TenantModule } from '@/store/modules/tenant'

export class SwitchTenant extends FunctionNode {
  async run() {
    const { client } = this.inputs
    const tenant = client.data
    if (!tenant) return
    const { origin, desktop } = ConfigModule
    const path = desktop.visible ? '/desktop' : '/mine'
    const { slug, use_slug } = tenant
    TenantModule.changeCurrentTenant(tenant)
    let url = ''
    if (slug && use_slug) {
      ConfigModule.setSlug(slug)
      url =
        origin.replace(
          window.location.protocol + '//',
          window.location.protocol + '//' + slug + '.',
        ) +
        path +
        getBaseUrl() +
        '?token=' +
        getToken()
      window.location.replace(url)
    } else {
      ConfigModule.setSlug()
      url =
        origin +
        path +
        getBaseUrl() +
        `?tenant=${TenantModule.currentTenant.uuid}&token=${getToken()}`
    }
    window.location.replace(url)
  }
}
