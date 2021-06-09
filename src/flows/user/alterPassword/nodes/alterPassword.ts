import { APINode } from "arkfbp/lib/apiNode"

export class AlterPassword extends APINode {
  async run() {
    this.url = '/api/v1/user/update_password/'
    this.method = 'POST'
    this.params = this.inputs.params
    await super.run()
  }
}
