import { APINode } from "arkfbp/lib/apiNode"
import { getOriginUrl, setOriginUrl } from '@/utils/cookies'

export class GetOriginUrl extends APINode {
  async run() {
    const originUrl = getOriginUrl()
    if (!originUrl) {
      this.url = '/api/v1/get_frontendurl/'
      this.method = 'GET'
      const outputs = await super.run()
      const url = outputs.url as string
      setOriginUrl(url)
    }
  }
}
