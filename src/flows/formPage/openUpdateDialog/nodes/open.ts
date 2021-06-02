import FormPageState from '@/admin/FormPage/FormPageState'
import OpenDialog from '@/nodes/openDialog'
import DialogState from '@/admin/common/Others/Dialog/DialogState'

export class OpenUpdateDialog extends OpenDialog {
  get dialog():DialogState | null {
    const tempState: FormPageState =  this.getState()
    if (tempState && tempState.dialogs) {
      return tempState.dialogs.update
    } else {
      return null
    }
  }

  getValue(prop) {
    return this.inputs.outputs[prop]
  }

  getDialogData() {
    return this.inputs.outputs
  }
}