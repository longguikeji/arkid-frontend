import { BaseState } from '@/admin/base/BaseVue'

export default interface CascaderState extends BaseState {
  value: string // v-model  绑定值  string / number  —  —
  options: Array<any> // 可选项数据源，键名可通过 Props 属性配置
  props: object // 配置选项
  size: string //  输入框尺寸  string  medium / small / mini  —
  placeholder: string // 输入框占位文本 string 请选择
  disabled: boolean //  禁用  boolean  —  false
  clearable: boolean //  是否可清空  boolean  —  false
  showAllLevels: boolean //  输入框中是否显示选中值的完整路径  boolean  —  true
  collapseTags: boolean //  多选模式下是否折叠Tag  boolean  —  false
  separator: string // 选项分隔符 string   斜杠' / '
  filterable: boolean //  是否可搜索选项  boolean  —  -
  filterMethod: Function // 自定义搜索逻辑 第一个参数是节点node 第二个参数是搜索关键词keyword 通过返回布尔值表示是否命中 function(node, keyword)
  debounce: number // 搜索关键词输入的去抖延迟 毫秒
  beforeFilter: Function // 筛选之前的钩子 参数为输入的值 若返回 false 或者返回 Promise 且被 reject 则停止筛选 function(value) — —
  popperClass: string // 自定义浮层类名  筛选之前的钩子 参数为输入的值 若返回 false 或者返回 Promise 且被 reject 则停止筛选 function(value) — —

  type: string // 类别
}
