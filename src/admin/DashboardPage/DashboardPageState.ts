import DashboardItemState from './DashboardItem/DashboardItemState'
import { BaseState } from '@/admin/base/BaseVue'

export default interface DashboardPageState extends BaseState {
  type: string
  pages: Array<string>
  items?: Array<DashboardItemState>
}
