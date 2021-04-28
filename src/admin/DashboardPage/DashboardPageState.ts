import DashboardItemState from './DashboardItem/DashboardItemState'
import { BaseState } from '@/admin/base/BaseVue'
import { FlowConfig } from '@/arkfbp'

export default interface DashboardPageState extends BaseState {
  type: string
  pages: Array<string>
  items?: Array<DashboardItemState>
  actions?: { [name: string]: Array<FlowConfig | string> }
}
