import { BaseState } from '@/admin/base/BaseVue'

export default interface LinkState extends BaseState {
  type?: string; // 类型 primary / success / warning / danger / info
  underline?: boolean; // 是否下划线 
  disabled?: boolean; // 是否禁用状态 
  icon?: string; // 图标类名 
  value?: string; // 链接名称
  displayContent?: string; // 显示内容 icon 还是 链接
}