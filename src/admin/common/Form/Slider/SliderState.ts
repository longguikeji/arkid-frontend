import { BaseState } from '@/admin/base/BaseVue'

export default interface SliderState extends BaseState {
  value: number;
  min: number; //最小值
  max: number; //最大值
  disabled: boolean; //是否禁用
  step: number; //步长
  showInput: boolean; //是否显示输入框，仅在非范围选择时有效
  showInputControls: boolean; //在显示输入框的情况下，是否显示输入框的控制按钮
  inputSize: boolean; //输入框的尺寸
  showStops: boolean; //是否显示间断点
  showTooltip: boolean; //是否显示 tooltip
  formatTooltip: Function; //格式化 tooltip message
  range: boolean; // 是否为范围选择
  vertical: boolean; // 是否竖向模式
  height: string; // Slider 高度，竖向模式时必填
  label: string; // 屏幕阅读器标签
  debounce: number; //输入时的去抖延迟，毫秒，仅在show-input等于true时有效
  tooltipClass: string; //tooltip 的自定义类名
  marks: object; //标记， key 的类型必须为 number 且取值在闭区间 [min, max] 内，每个标记可以单独设置样式
}
