import OpenDialog from '@/nodes/openDialog'
import DialogState from '@/admin/common/Others/Dialog/DialogState'
import TreePageState from '@/admin/TreePage/TreePageState'

export class Open extends OpenDialog {
  get dialog():DialogState | null {
    const tempState: TreePageState = this.getState()
    if (tempState && tempState.dialogs) {
      return tempState.dialogs.addTreeNode
    } else {
      return null
    }
  }
}