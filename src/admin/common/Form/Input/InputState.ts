import { BaseState } from '@/admin/base/BaseVue'

export default interface InputState extends BaseState {
  type: string //  类型  string  text，textarea 和其他 原生 input 的 type 值  text
  value: string|number // / v-model  绑定值  string / number  —  —
  maxlength: number //  原生属性，最大输入长度  number  —  —
  minlength: number //  原生属性，最小输入长度  number  —  —
  showWordLimit: boolean //  是否显示输入字数统计，只在 type = "text" 或 type = "textarea" 时有效  boolean  —  false
  placeholder: string //  输入框占位文本  string  —  —
  clearable: boolean //  是否可清空  boolean  —  false
  showPassword: boolean //  是否显示切换密码图标  boolean  —  false
  disabled: boolean //  禁用  boolean  —  false
  size: string //  输入框尺寸，只在 type!="textarea" 时有效  string  medium / small / mini  —
  prefixIcon: string //  输入框头部图标  string  —  —
  suffixIcon: string //  输入框尾部图标  string  —  —
  rows: number //  输入框行数，只对 type="textarea" 有效  number  —  2
  autosize: boolean|object //  自适应内容高度，只对 type="textarea" 有效，可传入对象，如，{ minRows:  2, maxRows:  6 }  boolean / object  —  false
  autocomplete: string //  原生属性，自动补全  string  on, off  off
  autoComplete: string //  下个主版本弃用  string  on, off  off
  name: string //  原生属性  string  —  —
  readonly: boolean //  原生属性，是否只读  boolean  —  false
  max: number //  原生属性，设置最大值  —  —  —
  min: number //  原生属性，设置最小值  —  —  —
  step: number //  原生属性，设置输入字段的合法数字间隔  —  —  —
  resize: string //  控制是否能被用户缩放  string  none, both, horizontal, vertical  —
  autofocus: boolean //  原生属性，自动获取焦点  boolean  true, false  false
  form: string //  原生属性  string  —  —
  label: string //  输入框关联的label文字  string  —  —
  tabindex: string //  输入框的tabindex  string  -  -
  validateEvent: boolean //  输入时是否触发表单的校验  boolean  -  true
}
