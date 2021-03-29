import { TokenAPINode } from '@/arkfbp/nodes/tokenAPINode'
import { runFlowByFile } from '@/arkfbp/index'
import getUrl from '@/utils/get-url'
import getDialogParams from '@/utils/get-dialog-params'
import FormPageState from '@/admin/FormPage/FormPageState'
import TablePageState from '@/admin/TablePage/TablePageState'

export class Update extends TokenAPINode {
  async run() {
    const tempState: TablePageState = location.pathname === '/tenant' ? this.inputs.com.$store.state.tenant.tenantState : this.inputs.com.$store.state.admin.adminState

    const data = tempState.dialogs?.update.data
    if (!data) {
      throw Error('current dialog is not data')
    }

    this.url = getUrl(this.inputs.params.updateUrl, data)
    this.method = this.inputs.params.updateMethod || 'put'
    if (!this.url) {
      throw Error('URL not is not vaild')
    }
    
    if (tempState && tempState.dialogs && tempState.dialogs.update) {
      const currentUpdateFormPage = tempState.dialogs.update.state as FormPageState
      this.params = getDialogParams(currentUpdateFormPage)
    } else {
      throw Error('update action is not params, please check')
    }
    
    this.$state.commit((state: any) => {
      state.client = tempState
    })
    const outputs = await super.run()
    tempState.dialogs.update.visible = false
    await runFlowByFile('flows/tablePage/fetch', this.inputs)
    return outputs
  }
}
