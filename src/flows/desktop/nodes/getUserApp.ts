import { AuthApiNode } from '@/nodes/authApiNode'
import getUrl from '@/utils/url'

export class GetUserApp extends AuthApiNode {
  async run() {
    // get user app list 
    this.url = this.inputs.url
    this.method = this.inputs.method
    const outputs = await super.run()
    return outputs
  }
}
