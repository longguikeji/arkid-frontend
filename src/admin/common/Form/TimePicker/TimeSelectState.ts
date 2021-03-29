import { BaseState } from '@/admin/base/BaseVue'

export default interface TimeSelectState extends BaseState {
  value: Date|string; // date(TimePicker) / string(TimeSelect)
  readonly: boolean; //完全只读
  disabled: boolean; //禁用
  editable: boolean; //文本框可输入
  clearable: boolean; //是否显示清除按钮
  size: string; //输入框尺寸
  placeholder: string; //非范围选择时的占位内容
  startPlaceholder: string; //范围选择时开始日期的占位内容
  endPlaceholder: string; //范围选择时开始日期的占位内容,仅对<el-time-picker>有效
  isRange: boolean; //是否为时间范围选择 仅对<el-time-picker>有效
  arrowControl: boolean; //是否使用箭头进行时间选择
  align: string; //对齐方式
  popperClass: string; //TimePicker 下拉框的类名
  pickerOptions: object; //当前时间日期选择器特有的选项参考下表
  rangeSeparator: string; //选择范围时的分隔符  - '-'
  valueFormat: string; //可选，仅TimePicker时可用，绑定值的格式。不指定则绑定值为 Date 对象
  defaultValue: Date|string; //可选，选择器打开时默认显示的时间
  name: string; //原生属性
  prefixIcon: string; //自定义头部图标的类名
  clearIcon: string; //自定义清空图标的类名
  selectableRange: string|Array<string>; //可选时间段，例如'18:30:00 - 20:30:00'或者传入数组['09:30:00 - 12:00:00', '14:30:00 - 18:30:00']
  format: string; //时间格式化(TimePicker) string
  type: string; //区别datepicker  和dateselect
}
