import PickerOptionState from './PickerOptionsState'
import { BaseState } from '@/admin/base/BaseVue'

export default interface DatePickerState extends BaseState {
  value: Date|string // date(TimePicker) / string(TimeSelect)
  readonly: boolean // 完全只读
  disabled: boolean // 禁用
  editable: boolean // 文本框可输入
  clearable: boolean // 是否显示清除按钮
  size: string // 输入框尺寸
  placeholder: string // 非范围选择时的占位内容
  startPlaceholder: string // 范围选择时开始日期的占位内容
  endPlaceholder: string // 范围选择时开始日期的占位内容,仅对<el-time-picker>有效
  type: string // 显示类型 string year/month/date/dates/ week/datetime/datetimerange/ daterange/monthrange date
  format: string // 显示在输入框中的格式 string 见日期格式 yyyy-MM-dd
  align: string // 对齐方式 string left, center, right left
  popperClass: string // DatePicker 下拉框的类名 string — —
  pickerOptions: Array<PickerOptionState> // 当前时间日期选择器特有的选项参考下表 object — {}
  rangeSeparator: string // 选择范围时的分隔符 string — '-'
  defaultValue: Date // 可选，选择器打开时默认显示的时间 Date 可被new Date()解析 —
  defaultTime: string // 范围选择时选中日期所使用的当日内具体时刻 string[] 数组，长度为 2，每项值为字符串，形如12:00:00，第一项指定开始日期的时刻，第二项指定结束日期的时刻，不指定会使用时刻 00:00:00 —
  valueFormat: Date // 可选，绑定值的格式。不指定则绑定值为 Date 对象 string 见日期格式 —
  name: string // 原生属性 string — —
  unlinkPanels: boolean // 在范围选择器里取消两个日期面板之间的联动 boolean — false
  prefixIcon: string // 自定义头部图标的类名 string — el-icon-date
  clearIcon: string // 自定义清空图标的类名
  validateEvent: boolean // 输入时是否触发表单的校验 boolean
}
