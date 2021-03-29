import { BaseState } from '@/admin/base/BaseVue'

export default interface StepState extends BaseState {
  title?: string; // 标题
  description?: string; // 描述性文字 
  icon?: string; // 图标 传入 icon 的 class 全名来自定义 icon，也支持 slot 方式写入 
  status?: string; // 设置当前步骤的状态，不设置则根据 steps 确定状态 wait / process / finish / error / success 
}