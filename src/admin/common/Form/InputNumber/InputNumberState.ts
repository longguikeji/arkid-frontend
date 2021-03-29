import { BaseState } from '@/admin/base/BaseVue'

export default interface InputNumberState extends BaseState {
  value: string|number|boolean;
  min: number; //设置计数器允许的最小值
  max: number; //设置计数器允许的最大值
  step: number; //计数器步长
  stepStrictly: boolean; //是否只能输入 step 的倍数
  precision: number; //数值精度
  size: string; //计数器尺寸
  disabled: boolean; //是否禁用计数器
  controls: boolean; //是否使用控制按钮
  controlsPosition: string; //控制按钮位置
  name: string; //原生属性
  label: string; //输入框默认 placeholder
  placeholder: string; //输入框默认 placeholder
}
