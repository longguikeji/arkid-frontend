import MenuItemState from './MenuItemState'
import { BaseState } from '@/admin/base/BaseVue'

export default interface SubmenuState extends BaseState {
  title?: string; // 下拉菜单的主标题
  children?: Array<MenuItemState>|SubmenuState; // 菜单下拉内容下面的子选项
  index?: string|null; // 唯一标志  null
  popperClass?: string; // 弹出菜单的自定义类名 
  showTimeout?: number; // 展开 sub-menu 的延时  300
  hideTimeout?: number; // 收起 sub-menu 的延时  300
  disabled?: boolean; // 是否禁用 false
  popperAppendToBody?: boolean; // 是否将弹出菜单插入至 body 元素。在菜单的定位出现问题时，可尝试修改该属性 一级子菜单：true / 非一级子菜单：false 
  icon?: string; // 需要显示的icon-class
}