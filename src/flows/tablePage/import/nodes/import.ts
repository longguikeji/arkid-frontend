import { AuthApiNode } from '@/nodes/authApiNode'
import getUrl from '@/utils/url'

export class Import extends AuthApiNode {
  async run() {
    const tempState = this.getState()
    const data = tempState.dialogs?.import.data

    this.url = getUrl(this.inputs.params.url, data)
    this.method = this.inputs.params.method || 'POST'

    const outputs = await super.run()
    return outputs
  }
}
