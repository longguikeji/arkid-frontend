import { BaseState } from '@/admin/base/BaseVue'

export default interface ProgressState extends BaseState {
  value: number // 百分比（必填）1-100
  type?: string // 进度条类型 line/circle/dashboard
  strokeWidth?: number // 进度条的宽度，单位 px
  textInside?: boolean // 进度条显示文字内置在进度条内（只在 type=line 时可用）
  status?: string // 进度条当前状态 success/exception/warning
  width?: number // 环形进度条画布宽度（只在 type 为 circle 或 dashboard 时可用）
  showText?: boolean // 是否显示进度条文字内容
  strokeLinecap?: string // circle/dashboard 类型路径两端的形状 butt/round/square
  color?: string|Array<object> // 自定义进度条不同时期的背景色
  format?: Function // 可以指定进度条的文字内容
}
