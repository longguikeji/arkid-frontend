import { BaseState } from '@/admin/base/BaseVue'

export default interface PageHeaderState extends BaseState {
  title?: string; // 标题
  content?: string; // 内容
}