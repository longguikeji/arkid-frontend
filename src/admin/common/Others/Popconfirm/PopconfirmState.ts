import { BaseState } from '@/admin/base/BaseVue'

export default interface PopconfirmState extends BaseState {
  title: string; // 标题 String — —
  confirmButtonText: string; // 确认按钮文字 String — —
  cancelButtonText: string; // 取消按钮文字 String — —
  confirmButtonType: string; // 确认按钮类型 String — Primary
  cancelButtonType: string; // 取消按钮类型 String — Text
  icon: string; // Icon String — el-icon-question
  iconColor: string; // Icon 颜色 String — #f90
  hideIcon: boolean; // 是否隐藏 Icon Boolean — false
  content: string;
}
