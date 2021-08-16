import { Fetch } from '@/arkfbp/flows/fetch/nodes/fetch'

export class Filter extends Fetch {
  async run() {
    const params = this.inputs.params
    if (params) {
      let filterParams = {}
      Object.keys(params).forEach(key => {
        if (params[key]) {
          filterParams[key] = params[key]
        }
      })
      this.inputs.params = { ...filterParams }
    }
    const outputs = await super.run()
    return outputs
  }
}
