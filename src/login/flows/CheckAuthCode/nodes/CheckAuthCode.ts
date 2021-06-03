import { APINode } from "arkfbp/lib/apiNode"
// import { jsonp } from 'vue-jsonp'

export class CheckAuthCode extends APINode {
  async run() {
    const { key, value } = this.inputs.authcode
    if (!key || !value) {
      return false
    }
    this.url = '/api/v1/authcode/check'
    this.method = 'POST'
    this.params = {
      file_name: key,
      code: value
    }
    const response = await super.run()
    return response.is_succeed === 0 ? true : false
  }
}
