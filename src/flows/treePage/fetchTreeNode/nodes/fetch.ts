import { AuthApiNode } from '@/nodes/authApiNode'
import getUrl from '@/utils/url'

export class Fetch extends AuthApiNode {
  async run() {
    const tempState = this.getState()
    
    this.url = getUrl(this.inputs.params.fetchUrl)
    this.method = this.inputs.params.fetchMethod || 'get'
    if (!this.url) {
      throw Error('treePage fetchTreeNode flow is not url')
    }
    
    this.$state.commit((state: any) => {
      state.client = tempState
      state.params = this.inputs.params
    })
    
    const outputs = await super.run()
    return outputs
  }
}
