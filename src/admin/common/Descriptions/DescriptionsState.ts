import { BaseState } from '@/admin/base/BaseVue'
import ButtonState from '@/admin/common/Button/ButtonState'

export interface DescriptionsItemState {
  label?: string;
  span?: number;
  labelClassName?: string;
  contentClassName?: string;
  labelStyle?: object;
  contentStyle?: object;
  value?: any
}

export interface DescriptionsItemsState {
  [key: string]: DescriptionsItemState | DescriptionsObjectItemsState
}

export interface DescriptionsObjectItemsState extends DescriptionsState {
  label?: string
}

export default interface DescriptionsState extends BaseState {
  items: DescriptionsItemsState // items state
  border?: boolean // 是否带有边框
  column?: number // 一行 Descriptions Item 的数量
  direction?: string // 排列的方向
  size?: string // 列表的尺寸
  title?: string // 标题文本，显示在左上方
  colon?: boolean // 是否显示冒号	
  labelClassName?: string // 自定义标签类名
  contentClassName?: string // 自定义内容类名
  labelStyle?: object // 自定义标签样式
  contentStyle?: object // 自定义内容样式
  buttons?: ButtonState[] // 按钮操作
}