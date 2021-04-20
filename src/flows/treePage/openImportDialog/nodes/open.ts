import DialogState from '@/admin/common/Others/Dialog/DialogState'
import TreePageState from '@/admin/TreePage/TreePageState'
import OpenDialog from '@/nodes/openDialog'

export class Open extends OpenDialog {
  get dialog():DialogState | null {
    const tempState: TreePageState = this.getState()
    if (tempState?.dialogs?.import) {
      return tempState.dialogs.import
    } else {
      return null
    }
  }
}
