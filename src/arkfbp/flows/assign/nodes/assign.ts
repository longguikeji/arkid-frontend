import { ClientResponseNode } from '@/arkfbp/nodes/clientResponseNode'
import { proxyClientServer } from '@/utils/flow'

export class Assign extends ClientResponseNode {
  async run() {
    this.$state.commit(state => {
      state.type = 'assign'
      state.client = this.inputs.client
      state.clientServer = proxyClientServer(this.inputs.clientServer)
    })
    await super.run()
  }
}
