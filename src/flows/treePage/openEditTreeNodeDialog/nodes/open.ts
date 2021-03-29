import OpenDialog from '@/nodes/openDialog'
import DialogState from '@/admin/common/Others/Dialog/DialogState'
import TreePageState from '@/admin/TreePage/TreePageState'

export class Open extends OpenDialog {

  get dialog():DialogState | null {
    const tempState: TreePageState = location.pathname === '/tenant' ? this.inputs.com.$store.state.tenant.tenantState : this.inputs.com.$store.state.admin.adminState
    if (tempState && tempState.dialogs) {
      return tempState.dialogs.editTreeNode
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