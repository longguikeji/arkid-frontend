import { APINode } from 'arkfbp/lib/apiNode'
import { ConfigModule } from '@/store/modules/config'

export class OriginNode extends APINode {

  async run() {
    this.url = '/api/v1/get_frontendurl/'
    this.method = 'GET'
    const res = await super.run()
    if (res.url) {
      ConfigModule.setOrigin(res.url)
    }
  }

}