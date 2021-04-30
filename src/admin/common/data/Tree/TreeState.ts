import { BaseState } from '@/admin/base/BaseVue'
import TreeNodeProps from './TreeNodeProps'

import { FlowState } from '@/admin/base/BaseVue'

export default interface TreeState extends BaseState {
  data?: Array<TreeNodeProps> // 展示数据
  selectedData?: any // 选中的数据
  emptyText?: string // 内容为空的时候展示的文本
  nodeKey?: string // 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
  props?: TreeNodeProps // 配置选项，具体看 TreeNodeProps.ts 文件
  renderAfterExpand?: boolean // 是否在第一次展开某个树节点后才渲染其子节点
  load?: Function // 加载子树数据的方法，仅当 lazy 属性为true 时生效
  renderContent?: Function // 树节点的内容区的渲染 Function
  highlightCurrent?: boolean // 是否高亮当前选中节点，默认值是 false。
  defaultExpandAll?: boolean // 是否默认展开所有节点
  expandOnClickNode?: boolean // 是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。
  checkOnClickNode?: boolean // 是否在点击节点的时候选中节点，默认值为 false，即只有在点击复选框时才会选中节点。
  autoExpandParent?: boolean // 展开子节点的时候是否自动展开父节点
  defaultExpandedKeys?: Array<any> // 默认展开的节点的 key 的数组
  showCheckbox?: boolean // 节点是否可被选择
  checkStrictly?: boolean // 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
  defaultCheckedKeys?: boolean // 默认勾选的节点的 key 的数组
  currentNodeKey?: string|number // 当前选中的节点
  isFilter?: boolean // 是否要对树节点进行过滤筛选操作
  filterNodeMethod?: Function // 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
  accordion?: boolean // 是否每次只打开一个同级树节点展开
  indent?: number // 相邻级节点间的水平缩进，单位为像素
  iconClass?: string // 自定义树节点的图标
  lazy?: boolean // 是否懒加载子节点，需与 load 方法结合使用
  draggable?: boolean // 是否开启拖拽节点功能
  allowDrag?: Function // 判断节点能否被拖拽
  allowDrop?: Function // 拖拽时判定目标节点能否被放置。type 参数有三种情况：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
  slot?: any // 可以添加一些自定义的内容，比如在节点后添加操作按钮等
  slotState?: { [key: string]: { type: string, state: any} }// slotState
  action?: Function | string // 给tree添加action，当点击节点时触发action内容
}
