import { BaseState } from '@/admin/base/BaseVue'

export default interface CheckButtonState extends BaseState {
  label: string|number|boolean; // 选中状态的值（只有在checkbox-group或者绑定对象类型为array时有效） string / number / boolean — —
  trueLabel: string|number; // 选中时的值 string / number — —
  falseLabel: string|number; // 没有选中时的值 string / number — —
  disabled: boolean; // 是否禁用 boolean — false
  name: string; // 原生 name 属性 string — —
  checked: boolean; // 当前是否勾选 boolean — false
  content: string|number|boolean;
}
