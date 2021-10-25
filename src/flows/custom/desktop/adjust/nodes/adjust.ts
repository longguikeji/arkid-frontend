import { APINode } from '@/arkfbp/nodes/apiNode'

export class AdjustDashboardNode extends APINode {
  async run() {
    this.url = '/api/v1/user/appdata/'
    this.method = 'PUT'
    const list = this.inputs.client.board.list
    if (list) {
      const data = new Array()
      list.forEach(item => {
        data.push(item.state.uuid)
      })
      this.params = {
        data
      }
      await super.run()
    }
  }
}
