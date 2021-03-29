import { BaseState } from '@/admin/base/BaseVue'

export default interface TagState extends BaseState {
  value: string
  type?: string // 类型 可选值：success/info/warning/danger
  closable?: boolean // 是否可关闭
  disableTransitions?: boolean // 是否禁用渐变动画
  hit?: boolean // 是否有边框描边
  color?: string // 背景色
  size?: string // 尺寸 medium / small / mini
  effect?: string // 主题 dark / light / plain
  newTagType?: string// 是否要新建标签的功能 默认值为空 传值为tag的type
}
