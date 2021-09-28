import { BaseState } from '@/admin/base/BaseVue'

export default interface SwitchState extends BaseState {
    value: string|number|boolean;
    disabled: boolean; //是否禁用
    width: number; //switch 的宽度（像素）
    activeIconClass: string; //switch 打开时所显示图标的类名
    inactiveIconClass: string; //switch 关闭时所显示图标的类名
    activeText: string; //switch 打开时的文字描述
    inactiveText: string; //switch 关闭时的文字描述
    activeValue: string|number|boolean; //switch 打开时的值
    inactiveValue: string|number|boolean; //switch 关闭时的值
    activeColor: string; //switch 打开时的背景色
    inactiveColor: string; //switch 关闭时的背景色
    name: string; //switch 对应的 name 属性
    validateEvent: string; //改变 switch 状态时是否触发表单的校验
    action?: string | Function; // 改变 switch 状态是触发的操作
  }
  