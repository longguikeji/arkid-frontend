import BaseState from '@/admin/base/BaseVue'
import ButtonState from '@/admin/common/Button/ButtonState'

export interface ListItemState {
  label: string
  value: string
  data?: any
}

export default interface ListState extends BaseState {
  title?: string // 标题
  items?: ListItemState[] // 条目
  clearable?: boolean // 是否可以删除
  disabled?: boolean // 是否禁用
  isActive?: boolean // 是否默认展开 - 只有 isExpand 为 true 是才能生效
  buttons?: ButtonState[] // 全局按钮操作
  detail?: any // 详情弹框
}