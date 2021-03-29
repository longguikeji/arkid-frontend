import { BaseState } from '@/admin/base/BaseVue'

export default interface MenuItemState extends BaseState {
  title: string; // 不需要下拉菜单的主标题
  index?: string; // 唯一标识
  route?: Object; // vue-router 路径对象
  disabled?: boolean; // 是否禁用 false
  icon?: string; // 需要显示的icon-class
}