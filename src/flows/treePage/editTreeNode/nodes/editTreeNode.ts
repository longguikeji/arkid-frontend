import { AuthApiNode } from '@/nodes/authApiNode'
import { runFlowByFile } from '@/arkfbp/index'
import getUrl from '@/utils/get-url'
import getDialogParams from '@/utils/get-dialog-params'
import TreePageState from '@/admin/TreePage/TreePageState'
import FormPageState from '@/admin/FormPage/FormPageState'

export class EditTreeNode extends AuthApiNode {
  async run() {
    const tempState: TreePageState = this.getState()
    
    const data = tempState.dialogs!['editTreeNode'].data
  
    this.url = getUrl(this.inputs.params.updateUrl, data)
    this.method = this.inputs.params.updateMethod || 'post'
    
    if (tempState && tempState.dialogs) {
      const formPage = tempState.dialogs['editTreeNode'].state as FormPageState
      this.params = getDialogParams(formPage)
    } else {
      throw Error('addTreeNode is not params, please check')
    }

    const outputs = await super.run()
    tempState.dialogs['editTreeNode'].visible = false
    await runFlowByFile('flows/treePage/fetchTreeNode', this.inputs)
    return outputs
  }
}
