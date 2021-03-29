import { BaseState } from '@/admin/base/BaseVue'

export default interface BacktopState extends BaseState {
    target: string;// 触发滚动的对象 string  
    visibilityHeight: number;// 滚动高度达到此参数值才出现 number  200
    right: number;// 控制其显示位置, 距离页面右边距 number  40
    bottom: number;// 控制其显示位置, 距离页面底部距离 number  40
  }
  