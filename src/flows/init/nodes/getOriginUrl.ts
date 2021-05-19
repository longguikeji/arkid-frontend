import { APINode } from "arkfbp/lib/apiNode"
import { getOriginUrl, setOriginUrl } from '@/utils/cookies'

export class GetOriginUrl extends APINode {
  async run() {
    const host = getOriginUrl()
    if (!host) {
      this.url = '/api/v1/get_frontendurl/'
      this.method = 'GET'
      const outputs = await super.run()
      const originUrl = outputs.url
      setOriginUrl(originUrl)
    }
  }
}
