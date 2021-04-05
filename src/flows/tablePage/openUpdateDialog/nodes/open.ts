import TablePageState from '@/admin/TablePage/TablePageState'
import OpenDialog from '@/nodes/openDialog'
import DialogState from '@/admin/common/Others/Dialog/DialogState'
import { isTenantState } from '@/utils/get-page-state'

export class Open extends OpenDialog {
  get dialog():DialogState | null {
    const tempState: TablePageState = isTenantState() ? this.inputs.com.$store.state.tenant.tenantState : this.inputs.com.$store.state.admin.adminState
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
