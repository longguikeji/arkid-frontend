import DialogState from '@/admin/common/Others/Dialog/DialogState'
import TablePageState from '@/admin/TablePage/TablePageState'
import OpenDialog from '@/nodes/openDialog'

export class Open extends OpenDialog {
  get dialog():DialogState | null {
    const tempState: TablePageState = location.pathname === '/tenant' ? this.inputs.com.$store.state.tenant.tenantState : this.inputs.com.$store.state.admin.adminState
    if (tempState && tempState.dialogs) {
      return tempState.dialogs.create
    } else {
      return null
    }
  }
}
