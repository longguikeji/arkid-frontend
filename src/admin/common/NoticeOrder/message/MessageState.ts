import { BaseState } from '@/admin/base/BaseVue'

export default interface MessageState extends BaseState {
  message: any; // 消息文字 
  type?: string; // 主题  success/warning/info/error 
  iconClass?: string; //  自定义图标的类名，会覆盖 type 
  dangerouslyUseHTMLString?: boolean; // 是否将 message 属性作为 HTML 片段处理 默认为false
  customClass?: string; // 自定义类名 
  duration?: number; // 显示时间, 毫秒。设为 0 则不会自动关闭  默认值3000
  showClose?: boolean; // 是否显示关闭按钮  
  center?: boolean; // 文字是否居中 
  onClose?: Function; // 关闭时的回调函数, 参数为被关闭的 message 实例 
  offset?: number; // Message 距离窗口顶部的偏移量 默认值20
}