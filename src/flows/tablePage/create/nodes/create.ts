import { TokenAPINode } from '@/arkfbp/nodes/tokenAPINode'
import { runFlowByFile } from '@/arkfbp/index'
import getUrl from '@/utils/get-url'
import getDialogParams from '@/utils/get-dialog-params'
import TablePageState from '@/admin/TablePage/TablePageState'
import FormPageState from '@/admin/FormPage/FormPageState'

export class Create extends TokenAPINode {
  async run() {
    const tempState:TablePageState = location.pathname === '/tenant' ? this.inputs.com.$store.state.tenant.tenantState : this.inputs.com.$store.state.admin.adminState

    const url = getUrl(this.inputs.params.createUrl)
    const method = this.inputs.params.createMethod
    if (!url) {
      throw Error('create flow is not url')
    }
    this.url = url
    this.method = method || 'post'
    
    if (tempState && tempState.dialogs && tempState.dialogs.create) {
      const currentCreateFormPage = tempState.dialogs.create.state as FormPageState
      this.params = getDialogParams(currentCreateFormPage)
    } else {
      throw Error('create action is not params, please check')
    }

    this.$state.commit((state: any) => {
      state.client = tempState
    })
    const outputs = await super.run()
    tempState.dialogs.create.visible = false
    await runFlowByFile('flows/tablePage/fetch', this.inputs)
    return outputs
  }
}
