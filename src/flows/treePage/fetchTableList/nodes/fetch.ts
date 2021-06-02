import { AuthApiNode } from '@/nodes/authApiNode'
import getUrl from '@/utils/url'

export class Fetch extends AuthApiNode {
  async run() {
    const tempState = this.getState()
    const data = this.inputs.params.data

    this.url = getUrl(this.inputs.params.fetchUrl, data)
    this.url = this.url + '?group=' + data.uuid
    this.method = this.inputs.params.fetchMethod || 'get'

    this.$state.commit((state: any) => {
      state.client = tempState
    })
    
    const outputs = await super.run()
    return {
      data: outputs,
      params: this.inputs.params,
    }
  }
}
