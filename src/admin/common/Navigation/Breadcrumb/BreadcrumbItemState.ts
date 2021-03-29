import { BaseState } from '@/admin/base/BaseVue'

export default interface BreadcrumbItemState extends BaseState {
  to?: String|Object; // 路由跳转对象，同 vue-router 的 to 
  replace?: string; // 在使用 to 进行路由跳转时，启用 replace 将不会向 history 添加新记录  默认值 false
  text?: string; // 标题文字说明
}