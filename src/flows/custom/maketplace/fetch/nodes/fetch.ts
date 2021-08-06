import { Fetch } from '@/arkfbp/flows/fetch/nodes/fetch'

export class FetchMaketplace extends Fetch {
  async run() {
    const params = this.inputs.params
    if (params) {
      let filterParams = {}
      Object.keys(params).forEach(key => {
        if (params[key].length) {
          filterParams[key] = params[key].join(',')
        }
      })
      this.inputs.params = { ...filterParams }
    }
    const outputs = await super.run()
    return outputs
  }
}
