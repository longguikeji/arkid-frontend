import BaseState from '@/admin/base/BaseVue'
import CardState from '@/admin/common/Card/CardState'

export default interface ListItemState {
  label: string
  value: string
  action?: string | Function
  index?: number
}

export interface ListState extends BaseState {
  header?: CardState
  items?: ListItemState[]
  clearable?: boolean
}