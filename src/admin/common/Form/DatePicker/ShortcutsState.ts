import { BaseState } from '@/admin/base/BaseVue'

export default interface ShortcutsState extends BaseState {
  text: string; // 标题文本 string — —
  onClick: Function; //选中后的回调函数，参数是 vm，可通过触发 'pick' 事件设置选择器的值。例如 vm.$emit('pick', new Date()) function — —
}
