import { TokenAPINode } from '@/arkfbp/nodes/tokenAPINode'
import { runFlowByFile } from '@/arkfbp/index'
import getUrl from '@/utils/get-url'
import getDialogParams from '@/utils/get-dialog-params'
import TreePageState from '@/admin/TreePage/TreePageState'
import FormPageState from '@/admin/FormPage/FormPageState'

export class EditTreeNode extends TokenAPINode {
  async run() {
    const tempState: TreePageState = location.pathname === '/tenant' ? this.inputs.com.$store.state.tenant.tenantState : this.inputs.com.$store.state.admin.adminState
    
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
