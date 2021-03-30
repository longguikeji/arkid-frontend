import { TokenAPINode } from '@/arkfbp/nodes/tokenAPINode'
import getUrl from '@/utils/get-url'

export class GetUserApp extends TokenAPINode {
  async run() {
    // get user app list 
    this.url = this.inputs.url
    this.method = this.inputs.method
    const outputs = await super.run()
    return outputs
  }
}
