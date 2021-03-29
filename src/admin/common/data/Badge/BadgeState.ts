import { BaseState } from '@/admin/base/BaseVue'

export default interface BadgeState extends BaseState {
  value?: any // 显示值 string, number
  max?: number // 最大值，超过最大值会显示 '{max}+'，要求 value 是 Number 类型
  isDot?: boolean // 小圆点
  hidden?: boolean // 隐藏 badge
  type?: string // 类型 primary / success / warning / danger / info
}
