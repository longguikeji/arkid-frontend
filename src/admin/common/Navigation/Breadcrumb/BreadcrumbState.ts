import BreadcrumbItemState from './BreadcrumbItemState'
import { BaseState } from '@/admin/base/BaseVue'

export default interface BreadcrumbState extends BaseState {
  separator?: string; // 分隔符  默认值 斜杠'/'
  separatorClass?: string; // 图标分隔符 class 默认值 -
  items?: Array<BreadcrumbItemState>;
}