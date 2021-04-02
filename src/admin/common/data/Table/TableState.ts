import TableColumnState from './TableColumn/TableColumnState'
import SpecialCellState from './SpecialCellState'
import { BaseState, FlowState } from '@/admin/base/BaseVue'

export default interface TableState extends BaseState {
  columns?: Array<TableColumnState>
  selection?: SpecialCellState
  selectAction?: Array<FlowState | Function>
  index?: SpecialCellState
  data?: Array<any> //  显示的数据  array — —
  height?: number|string //  Table 的高度，默认为自动高度。如果 height 为 number 类型，单位 px；如果 height 为 string 类型，则这个高度会设置为 Table 的 style.height 的值，Table 的高度会受控于外部样式。  string/number  —  —
  maxHeight?: string|number //  Table 的最大高度。合法的值为数字或者单位为 px 的高度。  string/number  —  —
  stripe?: boolean //  是否为斑马纹 table  boolean  —  false
  border?: boolean //  是否带有纵向边框  boolean  —  false
  size?: string //  Table 的尺寸  string  medium / small / mini  —
  fit?: boolean //  列的宽度是否自撑开  boolean  —  true
  showHeader?: boolean //  是否显示表头  boolean  —  true
  highlightCurrentRow?: boolean //  是否要高亮当前行  boolean  —  false
  currentRowKey?: string|number //  当前行的 key，只写属性  String,Number  —  —
  rowClassName?: Function|string //  行的 className 的回调方法，也可以使用字符串为所有行设置一个固定的 className。  Function({row, rowIndex})/String  —  —
  rowStyle?: Function //  行的 style 的回调方法，也可以使用一个固定的 Object 为所有行设置一样的 Style。  Function({row, rowIndex})/Object  —  —
  cellClassName?: Function|string //  单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className。  Function({row, column, rowIndex, columnIndex})/String  —  —
  cellStyle?: Function|object //  单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有单元格设置一样的 Style。  Function({row, column, rowIndex, columnIndex})/Object  —  —
  headerRowClassName?: Function|string //  表头行的 className 的回调方法，也可以使用字符串为所有表头行设置一个固定的 className。  Function({row, rowIndex})/String  —  —
  headerRowStyle?: Function|object //  表头行的 style 的回调方法，也可以使用一个固定的 Object 为所有表头行设置一样的 Style。  Function({row, rowIndex})/Object  —  —
  headerCellClassName?: Function|string //  表头单元格的 className 的回调方法，也可以使用字符串为所有表头单元格设置一个固定的 className。  Function({row, column, rowIndex, columnIndex})/String  —  —
  headerCellStyle?: Function|object //  表头单元格的 style 的回调方法，也可以使用一个固定的 Object 为所有表头单元格设置一样的 Style。  Function({row, column, rowIndex, columnIndex})/Object  —  —
  rowKey?: Function|string //  行数据的 Key，用来优化 Table 的渲染；在使用 reserve-selection 功能与显示树形数据时，该属性是必填的。类型为 String 时，支持多层访问：user.info.id，但不支持 user.info[0].id，此种情况请使用 Function。  Function(row)/String  —  —
  emptyText?: string //  空数据时显示的文本内容，也可以通过 slot="empty" 设置  String  —  暂无数据
  defaultExpandAll?: boolean //  是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效  Boolean  —  false
  expandRowKeys?: Array<string> //  可以通过该属性设置 Table 目前的展开行，需要设置 row-key 属性才能使用，该属性为展开行的 keys 数组。  Array  —
  defaultSort?: object //  默认的排序列的 prop 和顺序。它的prop属性指定默认的排序的列，order指定默认排序的顺序  Object  order?: ascending, descending  如果只指定了prop, 没有指定order, 则默认顺序是ascending
  tooltipEffect?: string //  tooltip effect 属性  String  dark/light
  showSummary?: boolean //  是否在表尾显示合计行  Boolean  —  false
  sumText?: string //  合计行第一列的文本  String  —  合计
  summaryMethod?: Function //  自定义的合计计算方法  Function({ columns, data })  —  —
  spanMethod?: Function //  合并行或列的计算方法  Function({ row, column, rowIndex, columnIndex })  —  —
  selectOnIndeterminate?: boolean //  在多选表格中，当仅有部分行被选中时，点击表头的多选框时的行为。若为 true，则选中所有行；若为 false，则取消选择所有行  Boolean  —  true
  indent?: number //  展示树形数据时，树节点的缩进  Number  —  16
  lazy?: boolean //  是否懒加载子节点数据  Boolean  —  —
  load?: Function //  加载子节点数据的函数，lazy 为 true 时生效，函数第二个参数包含了节点的层级信息  Function(row, treeNode, resolve)  —  —
  treeProps?: object //  渲染嵌套数据的配置选项  Object  —  { hasChildren?: 'hasChildren', children?: 'children' }
  sortable?: boolean // 是否可以进行表格每一行的拖拽动作
  sortAction?: Array<FlowState | Function> // 拖拽进行排序时，触发的相关流操作
  key?: number | string // 为了进行数据的更新
}
