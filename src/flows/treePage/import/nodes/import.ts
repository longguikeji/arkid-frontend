import { AuthApiNode } from '@/nodes/authApiNode'
import TreePageState from '@/admin/TreePage/TreePageState'
import getUrl from '@/utils/url'

export class Import extends AuthApiNode {
  async run() {
    const tempState: TreePageState = this.getState()
    const data = tempState.dialogs?.import?.state?.file
    if (!data || !data.raw) {
      throw Error('import file is empty')
    }
    this.url = getUrl(this.inputs.params.url)
    this.method = this.inputs.params.method || 'POST'
    let formData = new FormData();
    formData.append("file", data.raw);
    this.params = formData
    const outputs = await super.run()
    tempState.dialogs!.import.visible = false
    return outputs
  }
}
