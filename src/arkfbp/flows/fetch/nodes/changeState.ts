import { ClientResponseNode } from '@/arkfbp/nodes/clientResponseNode'

export class ChangeState extends ClientResponseNode {
  async run() {
    this.$state.commit(state => {
      state.type = 'fetch'
    })
    await super.run()
  }
}
