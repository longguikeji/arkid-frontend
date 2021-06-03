import { APINode } from 'arkfbp/lib/apiNode'
// import { jsonp } from 'vue-jsonp'

export class GetCode extends APINode {
  async run() {
    this.url = '/api/v1/authcode/generate'
    this.method = 'GET'
    const response = await super.run()
    return response.key
  }
}
