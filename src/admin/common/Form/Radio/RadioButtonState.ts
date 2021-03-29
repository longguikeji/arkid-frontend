import { BaseState } from '@/admin/base/BaseVue'

export default interface RadioButtonState extends BaseState {
  label: string|number; // Radio 的 value string / number — —
  disabled: boolean; // 是否禁用 boolean — false
  name: string; // 原生 name 属性 string — —
  content: string|number|boolean; //内容
}
