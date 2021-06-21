import { APINode } from "arkfbp/lib/apiNode"
import { GlobalValueModule } from '@/store/modules/global-value'

export class GetOriginUrl extends APINode {
  async run() {
    this.url = '/api/v1/get_frontendurl/'
    this.method = 'GET'
    const outputs = await super.run()
    const url = outputs.url as string
    GlobalValueModule.setOriginUrl(url)
  }
}
