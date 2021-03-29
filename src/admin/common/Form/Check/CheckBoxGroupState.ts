import { BaseState } from '@/admin/base/BaseVue'
import CheckBoxState from './CheckBoxState'
import CheckButtonState from './CheckButtonState'

export default interface CheckBoxGroupState extends BaseState {
  value: string|number|boolean
  disabled: boolean // 是否禁用
  size: string // Checkbox 的尺寸，仅在 border 为真时有效
  min: number // 可被勾选的 checkbox 的最小数量
  max: number // 可被勾选的 checkbox 的最大数量
  textColor: string // 按钮形式的 Checkbox 激活时的文本颜色
  fill: string // 按钮形式的 Checkbox 激活时的文本颜色
  checkBox: CheckBoxState
  checkButton: CheckButtonState
}
