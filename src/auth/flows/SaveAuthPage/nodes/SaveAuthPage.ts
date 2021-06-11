import { APINode } from "arkfbp/lib/apiNode"
// import { jsonp } from 'vue-jsonp'

export class SaveAuthPage extends APINode {
  async run() {
    this.url = this.inputs.url
    this.method = 'POST'
    this.params = {
      html: this.inputs.html
    }
    await super.run()
  }
}
