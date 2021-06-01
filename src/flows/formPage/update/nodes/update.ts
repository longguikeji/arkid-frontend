import { AuthApiNode } from '@/nodes/authApiNode'
import { runFlowByFile } from '@/arkfbp/index'
import getUrl from '@/utils/url'
import getDialogParams from '@/utils/get-dialog-params'

export class Update extends AuthApiNode {
  async run() {
    const tempState = this.getState()
    this.url = getUrl(this.inputs.params.url)
    this.method = (this.inputs.params.method as string).toUpperCase()
    this.params = getDialogParams(tempState.dialogs.update.state)    
    const outputs = await super.run()
    tempState.dialogs.update.visible = false
    await runFlowByFile('flows/formPage/fetch', this.inputs)
    return outputs
  }
}
