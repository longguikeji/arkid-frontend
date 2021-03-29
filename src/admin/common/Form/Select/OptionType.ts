import { BaseState } from '@/admin/base/BaseVue'

export default interface OptionType extends BaseState {
  value?: string|number|object|boolean // 选项的值
  label?: string|number // 选项的标签，若不设置则默认与value相同
  disabled?: boolean // 是否禁用该选项
  options?: Array<OptionType> // 是否有options的分区 以及 连续的多个子分区
}
