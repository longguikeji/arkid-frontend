import { AuthApiNode } from '@/nodes/authApiNode'
import getUrl from '@/utils/get-url'

export class Fetch extends AuthApiNode {
  async run() {
    const tempState = this.getState()
    
    this.url = getUrl(this.inputs.params.tableUrl)
    this.method = this.inputs.params.tableMethod || 'get'
    this.params = {
      group: this.inputs.params.data.uuid,
    }

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