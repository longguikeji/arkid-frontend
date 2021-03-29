import { BaseState } from '@/admin/base/BaseVue'

export default interface DividerState extends BaseState {
  value: string;
  direction?: string; //设置分割线方向 string horizontal / vertical horizontal
  contentPosition: string; // 设置分割线文案的位置 string left / right / center center
}
