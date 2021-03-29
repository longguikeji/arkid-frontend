import { BaseState } from '@/admin/base/BaseVue'

export default interface TabPaneState extends BaseState {
  label?: string; // 选项卡标题 
  disabled?: boolean; // 是否禁用 
  name?: string; // 与选项卡绑定值 value 对应的标识符，表示选项卡别名 
  closable?: boolean; // 标签是否可关闭 
  lazy?: boolean; // 标签是否延迟渲染 
  content?: string; // 文字内容 暂时代替渲染内容
}