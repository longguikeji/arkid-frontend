import DashboardItemState from './DashboardItem/DashboardItemState'
import CardState from '@/admin/common/Card/CardState'
import { BaseState } from '@/admin/base/BaseVue'
import DialogState from '@/admin/common/Others/Dialog/DialogState'
import { IFlow } from '@/arkfbp'

export interface DashboardPage extends BaseState {
  items?: Array<DashboardItemState>
  actions?: { [name: string]: Array<IFlow | string> }
  card?: CardState
  dialogs?: { [dialogName: string]: DialogState }
}