import { AuthApiNode } from '@/nodes/authApiNode'
import getUrl from '@/utils/url'

export class GetDialogValues extends AuthApiNode {
  async run() {
    const data = this.inputs.com.state.data

    this.url = getUrl(this.inputs.params.url, data)
    this.method = this.inputs.params.method || 'GET'
    const outputs = await super.run()
    
    return {
      outputs: outputs,
      com: this.inputs.com,
      params: this.inputs.params,
    }
  }
}