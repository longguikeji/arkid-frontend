import BaseState from '@/admin/base/BaseVue'
import CardState from '@/admin/common/Card/CardState'
import DescriptionsState from '@/admin/common/Descriptions/DescriptionsState'

export default interface ListItemState {
  label: string
  value: string
  action?: string | Function
  index?: number
  type?: string // 默认为 text(文本) link(外链) detail(详情)
  detail?: DescriptionsState | string
}

export interface ListState extends BaseState {
  header?: CardState
  items?: ListItemState[]
  clearable?: boolean
}