import DropdownItemState from './DropdownItemState'
import { BaseState } from '@/admin/base/BaseVue'

export default interface DropdownState extends BaseState {
  title?: string; // 下拉菜单出发按钮内容
  type?: string; // 菜单按钮类型，同 Button 组件(只在split-button为 true 的情况下有效) 
  size?: string; // 菜单尺寸，在split-button为 true 的情况下也对触发按钮生效 
  splitButton?: boolean; // 下拉触发元素呈现为按钮组
  placement?: string; // 菜单弹出位置 top/top-start/top-end/bottom/bottom-start/bottom-end 
  trigger?: string; // 触发下拉的行为 hover, click  默认为 hover 
  hideOnClick?: boolean; // 是否在点击菜单项后隐藏菜单  
  showTimeout?: number; // 展开下拉菜单的延时（仅在 trigger 为 hover 时有效） 默认为 200
  hideTimeout?: number; // 收起下拉菜单的延时（仅在 trigger 为 hover 时有效） 默认为 150
  tabindex?: number; // Dropdown 组件的 tabindex
  items?: Array<DropdownItemState>; // 下拉选项的内容
}