import BaseState from '@/admin/base/BaseVue'
import ButtonState from '@/admin/common/Button/ButtonState'
import DescriptionsState from '@/admin/common/Descriptions/DescriptionsState'

export interface ListItemState {
  label: string
  value: string
  action?: string | Function
  index?: number
  type?: string // 默认为 text(文本) link(外链) detail(详情)
  detail?: DescriptionsState | string
}

export default interface ListState extends BaseState {
  title?: string
  items?: ListItemState[]
  clearable?: boolean
  isExpand?: boolean
  buttons?: ButtonState[]
}