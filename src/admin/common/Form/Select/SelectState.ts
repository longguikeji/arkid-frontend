import OptionType from './OptionType'
import { BaseState, FlowState } from '@/admin/base/BaseVue'

export default interface SelectState extends BaseState {
  value?: any // 绑定值
  default?: any
  type?: string // el-group-option && el-option
  readonly?: boolean // 是否只读
  options?: Array<OptionType>
  multiple?: boolean // 是否多选
  disabled?: boolean // 是否禁用
  valueKey?: string // 作为 value 唯一标识的键名，绑定值为对象类型时必填
  size?: string // 输入框尺寸
  clearable?: boolean // 是否有清空选项
  collapseTags?: boolean // 多选时是否将选中值按文字的形式展示
  multipleLimit?: number // 多选时用户最多可以选择的项目数，为 0 则不限制
  name?: string // select input 的 name 属性
  autocomplete?: string // select input 的 autocomplete 属性
  placeholder?: string // 占位符
  filterable?: string // 是否可搜索
  allowCreate?: boolean // 是否允许用户创建新条目，需配合 filterable 使用
  filterMethod?: Function // 自定义搜索方法
  remote?: boolean // 是否为远程搜索
  remoteMethod?: string // Function
  loading?: boolean // 是否正在从远程获取数据
  loadingText?: string // 远程加载时显示的文字
  noMatchText?: string // 搜索条件无匹配时显示的文字，也可以使用slot="empty"设置
  noDataText?: string // 选项为空时显示的文字，也可以使用slot="empty"设置
  popperClass?: string // Select 下拉框的类名
  reserveKeyword?: boolean // 多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词
  defaultFirstOption?: boolean // 在输入框按下回车，选择第一个匹配项。需配合 filterable 或 remote 使用
  popperAppendToBody?: boolean // 是否将弹出框插入至 body 元素。在弹出框的定位出现问题时，可将该属性设置为 false
  automaticDropdown?: boolean // 对于不可搜索的 Select，是否在输入框获得焦点后自动弹出选项菜单
  action?: Array<FlowState | Function> // 下拉选项发生变化是出发的action动作
  required?: boolean // 是否必填
}
