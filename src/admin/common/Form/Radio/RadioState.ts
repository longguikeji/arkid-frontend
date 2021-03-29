import { BaseState } from '@/admin/base/BaseVue'

export default interface RadioState extends BaseState {
  value: string|number|boolean; // / v-model 绑定值 string / number / boolean — —
  label: string|number|boolean; // Radio 的 value string / number / boolean — —
  disabled: boolean; // 是否禁用 boolean — false
  border: false; // 是否显示边框 boolean — false
  size: string; // Radio 的尺寸，仅在 border 为真时有效 string medium / small / mini —
  name: string; // 原生 name 属性 string — —
  content: string|number|boolean; //内容
}
