import { AuthApiNode } from '@/nodes/authApiNode'
import getUrl from '@/utils/get-url'

export class Fetch extends AuthApiNode {
  async run() {
    const tempState = this.getState()

    this.url = getUrl(this.inputs.params.fetchUrl)
    this.method = this.inputs.params.fetchMethod || 'get'
    if (!this.url) {
      throw Error('formPage fetch flow is not url')
    }
    
    this.$state.commit((state: any) => {
      state.client = tempState
    })
    const outputs = await super.run()
    return outputs
  }
}
