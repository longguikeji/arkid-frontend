import { BaseState } from '@/admin/base/BaseVue'

export default interface ButtonState extends BaseState {
  label?: string // 按钮文本
  size?: string // 尺寸  string  medium / small / mini —
  type?: string // 类型 string primary / success / warning / danger / info / text  —
  plain?: boolean // 是否朴素按钮 boolean — false
  round?: boolean // 是否圆角按钮 boolean — false
  circle?: boolean // 是否圆形按钮 boolean — false
  loading?: boolean // 是否加载中状态 boolean — false
  disabled?: boolean // 是否禁用状态 boolean — false
  icon?: string // 图标类名 string — —
  autofocus?: boolean // 是否默认聚焦 boolean — false
  nativeType?: string // 原生 type 属性 string button / submit / reset button
  action?: Function | string // flow name
  data?: any // 绑定的一些其他所需数据
  hint?: string // 点击按钮后的提示文本 仅对danger/warning类型的按钮生效
  name?: string // Button按钮的名称 具有唯一性 在判断是否需要禁用/是否隐藏等方面可以使用
  form?: string // 按钮的格式 下拉框和排列 dropdown and row
  to?: string
}