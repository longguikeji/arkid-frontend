import { APINode } from 'arkfbp/lib/apiNode'
import { ConfigModule } from '@/store/modules/config'
import isIp from 'is-ip'

export class Entrance extends APINode {

  async run() {
    const hostIsIp = isIp(window.location.host)
    if (!hostIsIp) { // 当前地址为非ip形式
      this.url = '/api/v1/get_frontendurl/'
      this.method = 'GET'
      const outputs = await super.run()
      if (outputs && outputs.url) {
        ConfigModule.setOrigin(outputs.url)
      }
    }
  }

}