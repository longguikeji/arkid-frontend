import DashboardItemState from './DashboardItem/DashboardItemState'
import CardState from '@/admin/common/Card/CardState'
import { BaseState } from '@/admin/base/BaseVue'
import { IFlow } from '@/arkfbp'

export interface DashboardPage extends BaseState {
  items?: Array<DashboardItemState>
  actions?: { [name: string]: Array<IFlow | string> }
  card?: CardState
}

export default interface DashboardPageState {
  type?: string // DashboardPage
  state?: DashboardPage
}