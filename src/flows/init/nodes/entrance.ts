import { APINode } from '@/arkfbp/nodes/apiNode'
import { ConfigModule } from '@/store/modules/config'
import { setToken } from '@/utils/auth'

export class EntranceNode extends APINode {
  async run() {
    // get frontend url - for support slug
    this.url = '/api/v1/get_frontendurl/'
    this.method = 'get'
    const outputs = await super.run()
    const url = outputs?.url
    if (url) ConfigModule.setOrigin(url)

    // get backend auth info
    this.url = '/api/v1/backend_auth'
    this.method = 'get'
    const data = await super.run()
    const token = data?.token
    if (token) setToken(token)
  }
}