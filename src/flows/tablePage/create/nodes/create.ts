import { AuthApiNode } from '@/nodes/authApiNode'
import { runFlowByFile } from '@/arkfbp/index'
import getUrl from '@/utils/url'
import getDialogParams from '@/utils/get-dialog-params'
import TablePageState from '@/admin/TablePage/TablePageState'
import FormPageState from '@/admin/FormPage/FormPageState'

export class Create extends AuthApiNode {
  async run() {
    const tempState: TablePageState = this.getState()
    this.url = getUrl(this.inputs.params.url)
    this.method = this.inputs.params.method || 'post'
    if (!this.url) {
      throw Error('tablePage create flow is not url')
    }
    
    if (tempState && tempState.dialogs && tempState.dialogs.create) {
      const currentCreateFormPage = tempState.dialogs.create.state as FormPageState
      this.params = getDialogParams(currentCreateFormPage)
      if (!this.params) {
        const com = this.inputs.com
        com.$message({
          message: '缺少必要参数项',
          type: 'error',
          showClose: true
        })
        return null
      }
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
