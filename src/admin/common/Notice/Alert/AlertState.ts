import { BaseState } from '@/admin/base/BaseVue'

export default interface AlertState extends BaseState {
  title?: string // 标题
  type?: string // 主题 success/warning/info/error  info
  description?: string // 辅助性文字。也可通过默认 slot 传入
  closable?: boolean // 是否可以关闭  true
  center?: boolean // 文字是否居中 true
  closeText?: string // 关闭按钮自定义文本
  showIcon?: boolean // 是否显示图标
  effect?: string // 选择提供的主题
  slot?: string // slot
}
