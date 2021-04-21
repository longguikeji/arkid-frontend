import { AuthApiNode } from '@/nodes/authApiNode'
import { runFlowByFile } from '@/arkfbp/index'
import getUrl from '@/utils/url'
import getDialogParams from '@/utils/get-dialog-params'
import TreePageState from '@/admin/TreePage/TreePageState'
import FormPageState from '@/admin/FormPage/FormPageState'

export class AddTreeNode extends AuthApiNode {
  async run() {
    const tempState: TreePageState = this.getState()
    
    this.url = getUrl(this.inputs.params.url)
    this.method = this.inputs.params.method || 'post'
    if (!this.url) {
      throw Error('treePage addTreeNode flow is not url')
    }    
   
    if (tempState && tempState.dialogs) {
      const formPage = tempState.dialogs['addTreeNode'].state as FormPageState
      this.params = getDialogParams(formPage)
    } else {
      throw Error('addTreeNode is not params, please check')
    }

    const outputs = await super.run()
    tempState.dialogs['addTreeNode'].visible = false
    await runFlowByFile('flows/treePage/fetchTreeNode', this.inputs)
    return outputs
  }
}
