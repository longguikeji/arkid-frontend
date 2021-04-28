import { BaseState } from '@/admin/base/BaseVue'
export default interface TreeNodeProps extends BaseState {
  id?: number | string; // id
  uuid?: string; // uuid
  label?: string // 指定节点标签为节点对象的某个属性值
  children?: Array<TreeNodeProps> // 指定子树为节点对象的某个属性值
  disabled?: boolean // 指定节点选择框是否禁用为节点对象的某个属性值
  isLeaf?: boolean // 指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效
  action?: Function | string // 给每一个节点添加 action，当点击节点时触发该 action
}
