import SubmenuState from './SubmenuItem/SubmenuState'
import MenuItemState from './SubmenuItem/MenuItemState'
import { BaseState } from '@/admin/base/BaseVue'

export default interface NavMenuState extends BaseState {
  children: Array<SubmenuState>|Array<MenuItemState>; // 导航栏每一项菜单对应的数据选项
  mode?: string; // 模式  horizontal / vertical   vertical
  collapse?: boolean; // 是否水平折叠收起菜单（仅在 mode 为 vertical 时可用） 
  backgroundColor?: string; // 菜单的背景色（仅支持 hex 格式） #ffffff
  textColor?: string; // 菜单的文字颜色（仅支持 hex 格式） #303133
  activeTextColor?: string; // 当前激活菜单的文字颜色（仅支持 hex 格式） #409EFF
  defaultActive?: string; // 当前激活菜单的 index 
  defaultOpeneds?: Array<any>; // 当前打开的 sub-menu 的 index 的数组 
  uniqueOpened?: boolean; // 是否只保持一个子菜单的展开  false
  menuTrigger?: string; // 子菜单打开的触发方式(只在 mode 为 horizontal 时有效)  hover / click  hover
  router?: boolean; // 是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转 
  collapseTransition?: boolean; // 是否开启折叠动画 true 
}