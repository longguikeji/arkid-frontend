import CardState from '@/admin/common/Card/CardState'
import { BaseState } from '@/admin/base/BaseVue'
import DialogState from '@/admin/common/Dialog/DialogState'
import DragBoardState from '@/admin/common/Others/DragBoard/DragBoardState'
import { IFlow } from '@/arkfbp'

export interface DashboardPage extends BaseState {
  actions?: { [name: string]: Array<IFlow | string> }
  card?: CardState
  dialogs?: { [dialogName: string]: DialogState }
  board?: DragBoardState
}