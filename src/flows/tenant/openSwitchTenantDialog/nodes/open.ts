import DialogState from '@/admin/common/Others/Dialog/DialogState'
import TablePageState from '@/admin/TablePage/TablePageState'
import OpenDialog from '@/nodes/openDialog'

export class OpenSwitchTenantDialog extends OpenDialog {

  get dialog(): DialogState | null {
    const tempState: TablePageState = this.getState()
    if (tempState && tempState.dialogs) {
      return tempState.dialogs.switch
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