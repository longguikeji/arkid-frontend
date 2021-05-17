import { APINode } from "arkfbp/lib/apiNode"
import { TenantModule } from '@/store/modules/tenant'

export class GetOriginHost extends APINode {
  async run() {
    this.url = '/api/v1/get_frontendurl/'
    this.method = 'GET'
    const outputs = await super.run()
    const originHost = outputs.url
    TenantModule.setOriginHost(originHost)
  }
}
