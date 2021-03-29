import { BaseState } from '@/admin/base/BaseVue'

export default interface TooltipState extends BaseState {
  effect: string; // 默认提供的主题 String dark/light dark
  content: string; // 显示的内容，也可以通过 slot#content 传入 DOM String — —
  placement: string; // Tooltip 的出现位置 String top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end bottom
  value: boolean; // v-model 状态是否可见 Boolean — false
  disabled: boolean; // Tooltip 是否可用 Boolean — false
  transition: string; // 定义渐变动画 String — el-fade-in-linear
  visibleArrow: boolean; // 是否显示 Tooltip 箭头，更多参数可见Vue-popper Boolean — true
  popperOptions: Object; // popper.js 的参数 Object 参考 popper.js 文档 { boundariesElement: 'body', gpuAcceleration: false }
  openDelay: number; // 延迟出现，单位毫秒 Number — 0
  manual: boolean; // 手动控制模式，设置为 true 后，mouseenter 和 mouseleave 事件将不会生效 Boolean — false
  popperClass: string; // 为 Tooltip 的 popper 添加类名 String — —
  enterable: boolean; // 鼠标是否可进入到 tooltip 中 Boolean — true
  hideAfter: number; // Tooltip 出现后自动隐藏延时，单位毫秒，为 0 则不会自动隐藏 number — 0
  tabindex: number; // Tooltip 组件的 tabindex number — 0
  btn: string;
}
