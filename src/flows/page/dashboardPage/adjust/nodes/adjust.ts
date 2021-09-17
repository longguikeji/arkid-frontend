import { APINode } from '@/arkfbp/nodes/apiNode'

export class AdjustDashboardNode extends APINode {
  async run() {
    this.url = '/api/v1/user/appdata/'
    this.method = 'PUT'
    this.params = {
      data: this.inputs.items
    }
    await super.run()
  }
}
