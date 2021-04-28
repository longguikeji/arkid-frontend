import { BaseState, FlowState } from '@/admin/base/BaseVue'

export default interface PaginationState extends BaseState {
  currentPage?: number //  当前页数，支持 .sync 修饰符  number  —  1
  pageCount?: Number //
  total?: number //  总条目数  num总页数，total 和 page-count 设置任意一个就可以达到显示页码的功能；如果要支持 page-sizes 的更改，则需要使用 total 属性  Number  —  —

  pageSize?: number //  每页显示条目个数，支持 .sync 修饰符  number  —  10ber  —  —
  pageSizes?: Array<number> //  每页显示个数选择器的选项设置  number[]  —  [10, 20, 30, 40, 50, 100]

  layout?: string //  组件布局，子组件名用逗号分隔  String  sizes, prev, pager, next, jumper, ->, total, slot  'prev, pager, next, jumper, ->, total'

  small?: boolean //  是否使用小型分页样式  boolean  —  false
  background?: boolean //  是否为分页按钮添加背景色  boolean  —  false
  // pagerCount: number //  页码按钮的数量，当总页数超过该值时会折叠  number  大于等于 5 且小于等于 21 的奇数  7
  popperClass?: string //  每页显示个数选择器的下拉框类名  string  —  —
  prevText?: string //  替代图标显示的上一页文字  string  —  —
  nextText?: string //  替代图标显示的下一页文字  string  —  —
  disabled?: boolean //  是否禁用  boolean  —  false
  // hideOnSinglePage: boolean //  只有一页时是否隐藏  boolean  —  -
  actionSizeChange?: string
  actionCurrentChange?: string
  actionPrevClick?: string
  actionNextClick?: string
  action?: string | Function
  data?: any
}
