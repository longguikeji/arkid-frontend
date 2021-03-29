import { BaseState } from '@/admin/base/BaseVue'

export default interface CheckBoxState extends BaseState {
  value: string|number|boolean // v-model 绑定值 string / number / boolean — —
  label: string|number|boolean // 选中状态的值（只有在checkbox-group或者绑定对象类型为array时有效） string / number / boolean — —
  trueLabel: number // 选中时的值 string / number — —
  falseLabel: string|number // 没有选中时的值 string / number — —
  disabled: boolean // 是否禁用 boolean — false
  border: boolean // 是否显示边框 boolean — false
  size: string // Checkbox 的尺寸，仅在 border 为真时有效 string medium / small / mini —
  name: string // 原生 name 属性 string — —
  checked: boolean // 当前是否勾选 boolean — false
  indeterminate: boolean // 设置 indeterminate 状态，只负责样式控制 boolean — false
  content: string|number|boolean
}
