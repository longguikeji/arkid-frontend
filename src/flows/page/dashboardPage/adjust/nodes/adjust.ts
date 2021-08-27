import { AuthApiNode } from '@/arkfbp/nodes/authApiNode'

export class AdjustDashboardNode extends AuthApiNode {
  async run() {
    this.url = '/api/v1/user/appdata/'
    this.method = 'PUT'
    this.params = {
      data: this.inputs.items
    }
    await super.run()
  }
}
