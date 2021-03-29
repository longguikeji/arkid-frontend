import { BaseState } from '@/admin/base/BaseVue'

export default interface CollapseState extends BaseState {
  activeNames: string|Array<any>; // v-model 当前激活的面板(如果是手风琴模式，绑定值类型需要为string，否则为array) string / array — —
  data: object;
  accordion: boolean; // 是否手风琴模式 boolean — false
  name: string|number; // 唯一标志符 string/number — —
  title: string; // 面板标题 string — —
  disabled: boolean; // 是否禁用 boolean
}
