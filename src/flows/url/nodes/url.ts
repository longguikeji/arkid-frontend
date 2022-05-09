import { APINode } from '@/arkfbp/nodes/apiNode'

export class UrlNode extends APINode {
  async run() {
    this.url = '/api/v1/set_frontendurl/'
    this.method = 'post'
    this.params = this.inputs
    super.run().then(() => {
      window.location.reload()
    })
  }
}