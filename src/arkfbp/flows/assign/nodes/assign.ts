import { ClientResponseNode } from '@/arkfbp/nodes/clientResponseNode'

export class Assign extends ClientResponseNode {
  async run() {
    this.$state.commit(state => {
      state.type = 'assign'
      state.client = this.inputs.client
      state.clientServer = this.inputs.clientServer
    })
    await super.run()
  }
}
