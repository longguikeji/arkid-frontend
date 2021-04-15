import OpenDialog from '@/nodes/openDialog'
import DialogState from '@/admin/common/Others/Dialog/DialogState'
import TreePageState from '@/admin/TreePage/TreePageState'

export class Open extends OpenDialog {

  get dialog():DialogState | null {
    const tempState: TreePageState = this.getState()
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

  getOptions(prop) {
    if (this.inputs.outputs.parent && prop === 'parent_uuid') {
      return [
        {
          label: this.inputs.outputs.parent.name || '',
          value: this.inputs.outputs.parent.uuid || '',
        }
      ]
    } else {
      return []
    }
  }
}