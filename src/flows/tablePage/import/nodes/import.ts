import { AuthApiNode } from '@/nodes/authApiNode'
import getUrl from '@/utils/url'

export class Import extends AuthApiNode {
  async run() {
    const tempState = this.getState()
    const importDialog = tempState.dialogs?.import || tempState.table?.dialogs?.import
    const data = importDialog.state?.file
    if (!data || !data.raw) {
      throw Error('import file is empty')
    }
    this.url = getUrl(this.inputs.params.url)
    this.method = this.inputs.params.method || 'POST'
    let formData = new FormData();
    formData.append("file", data.raw);
    this.params = formData
    const outputs = await super.run()
    importDialog.visible = false
    return outputs
  }
}
