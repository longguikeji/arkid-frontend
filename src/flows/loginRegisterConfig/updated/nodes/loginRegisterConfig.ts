import { FunctionNode } from 'arkfbp/lib/functionNode'

export class LoginRegisterConfig extends FunctionNode {
  async run() {
    const tempState = this.inputs.state
    tempState.state.dialogs.update.state.state.form.items.data.state.items.upload_file_format.state.options = [
      { value: 'gif' }, { value: 'jpg' }, { value: 'png' }, { value: 'jpeg' }
    ]
    const saveConfig = {
      name: 'flows/loginRegisterConfig/saveConfig'
    }
    tempState.state.actions.update.push(saveConfig)
  }
}