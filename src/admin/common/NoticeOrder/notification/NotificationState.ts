import { BaseState } from '@/admin/base/BaseVue'

export default interface NotificationState extends BaseState {
  title?: string; // 标题
  message?: any; // 说明文字 
  dangerouslyUseHTMLString?: boolean; // 是否将 message 属性作为 HTML 片段处理 
  type?: string; // 主题样式，如果不在可选值内将被忽略 
  iconClass?: string; //  自定义图标的类名。若设置了 type，则 iconClass 会被覆盖
  customClass?: string; // 自定义类名 
  duration?: number; // 显示时间, 毫秒。设为 0 则不会自动关闭 
  position?: string; // 自定义弹出位置 
  showClose?: boolean; // 是否显示关闭按钮 
  onClose?: Function; // 关闭时的回调函数 
  onClick?: Function; // 点击 Notification 时的回调函数 
  offset?: number; // 偏移的距离，在同一时刻，所有的 Notification 实例应当具有一个相同的偏移量 
}