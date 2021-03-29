import { BaseState } from '@/admin/base/BaseVue'

export default interface PopoverState extends BaseState {
  trigger: string; //触发方式 String click/focus/hover/manual click
  title: string; // 标题 String — —
  content: string; // 显示的内容，也可以通过 slot 传入 DOM String — —
  width: string|number; // 宽度 String, Number — 最小宽度 150px
  placement: string; // 出现位置 String top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end bottom
  disabled: boolean; // Popover 是否可用 Boolean — false
  value: boolean; // / v-model 状态是否可见 Boolean — false
  offset: number; // 出现位置的偏移量 Number — 0
  transition: string; // 定义渐变动画 String — fade-in-linear
  visibleArrow: boolean; // 是否显示 Tooltip 箭头，更多参数可见Vue-popper Boolean — true
  popperOptions: object; // popper.js 的参数 Object 参考 popper.js 文档 { boundariesElement: 'body', gpuAcceleration: false }
  popperClass: string; // 为 popper 添加类名 String — —
  openDelay: number; // 触发方式为 hover 时的显示延迟，单位为毫秒 Number — —
  closeDelay: number; // 触发方式为 hover 时的隐藏延迟，单位为毫秒 number — 200
  tabindex: number; // Popover 组件的 tabindex number — 0
  btn: string;
}
