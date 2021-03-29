import { BaseState } from '@/admin/base/BaseVue'

export default interface LoadingState extends BaseState {
  target?: string; // Loading 需要覆盖的 DOM 节点。可传入一个 DOM 对象或字符串；若传入字符串，则会将其作为参数传入 document.querySelector以获取到对应 DOM 节点 
  body?: boolean; // 同 v-loading 指令中的 body 修饰符  默认值 false
  fullscreen?: boolean; //  同 v-loading 指令中的 fullscreen 修饰符   默认值 true
  lock?: boolean; // 同 v-loading 指令中的 lock 修饰符 
  text?: string; // 显示在加载图标下方的加载文案 
  spinner?: string; // 自定义加载图标类名 
  background?: string; // 遮罩背景色 
  customClass?: string; // Loading 的自定义类名 
}