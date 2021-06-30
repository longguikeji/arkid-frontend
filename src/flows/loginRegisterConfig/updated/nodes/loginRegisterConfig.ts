import { FunctionNode } from 'arkfbp/lib/functionNode'

export class LoginRegisterConfig extends FunctionNode {
  async run() {
    const state = this.inputs.state.state
    const options = [
      { value: 'gif' }, { value: 'jpg' }, { value: 'png' }, { value: 'jpeg' }
    ]
    const items = state.dialogs.update.state.state.form.items?.data?.state?.items
    if (items?.upload_file_format)
    items.upload_file_format.state.options = options
    const saveConfig = {
      name: 'flows/loginRegisterConfig/saveConfig'
    }
    state.actions.update.push(saveConfig)
  }
}