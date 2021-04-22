import { AuthApiNode } from '@/nodes/authApiNode'
import { runFlowByFile } from '@/arkfbp/index'
import getUrl from '@/utils/url'
import getDialogParams from '@/utils/get-dialog-params'
import TreePageState from '@/admin/TreePage/TreePageState'
import FormPageState from '@/admin/FormPage/FormPageState'

export class EditTreeNode extends AuthApiNode {
  async run() {
    const tempState: TreePageState = this.getState()

    if (!tempState.dialogs?.update) {
      throw Error('treePage is not update dialog')
    }
    
    const data = tempState.dialogs.update.data
  
    this.url = getUrl(this.inputs.params.url, data)
    this.method = this.inputs.params.method || 'post'
    
    const formPage = tempState.dialogs.update.state as FormPageState
    this.params = getDialogParams(formPage)

    const outputs = await super.run()
    tempState.dialogs.update.visible = false
    
    await runFlowByFile('flows/treePage/fetchTreeNode', this.inputs)
    return outputs
  }
}
