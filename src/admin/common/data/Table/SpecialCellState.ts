import { BaseState } from '@/admin/base/BaseVue'

export default interface SpecialCellState extends BaseState {
  exist?: boolean // 是否存在该单元
  values?: any // 多选框选中的值，用于selection选项
}
