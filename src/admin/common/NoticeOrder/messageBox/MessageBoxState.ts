import { BaseState } from '@/admin/base/BaseVue'

export default interface MessageBoxState extends BaseState {
  title?: string; // MessageBox 标题 
  message?: any; // MessageBox 消息正文内容
  dangerouslyUseHTMLString?: boolean; // 是否将 message 属性作为 HTML 片段处理 
  type?: string; // 消息类型，用于显示图标 
  iconClass?: string; //  自定义图标的类名，会覆盖 type
  customClass?: string; // MessageBox 的自定义类名 
  callback?: Function; // 若不使用 Promise，可以使用此参数指定 MessageBox 关闭后的回调 
  showClose?: boolean; // MessageBox 是否显示右上角关闭按钮 
  beforeClose?: Function; // MessageBox 关闭前的回调，会暂停实例的关闭 
  distinguishCancelAndClose?: boolean; // 是否将取消（点击取消按钮）与关闭（点击关闭按钮或遮罩层、按下 ESC 键）进行区分 
  lockScroll?: boolean; // 是否在 MessageBox 出现时将 body 滚动锁定 
  showCancelButton?: boolean; // 是否显示取消按钮 
  showConfirmButton?: boolean; // 是否显示确定按钮 
  cancelButtonText?: string; // 取消按钮的文本内容 
  confirmButtonText?: string; // 确定按钮的文本内容 
  cancelButtonClass?: string; // 取消按钮的自定义类名 
  confirmButtonClass?: string; // 确定按钮的自定义类名
  closeOnClickModal?: boolean; // 是否可通过点击遮罩关闭 MessageBox 
  closeOnPressEscape?: boolean; // 是否可通过按下 ESC 键关闭 MessageBox 
  closeOnHashChange?: boolean; // 是否在 hashchange 时关闭 MessageBox 
  showInput?: boolean; // 是否显示输入框 
  inputPlaceholder?: string; //  输入框的占位符 
  inputType?: string; // 输入框的类型 
  inputValue?: string; // 输入框的初始文本 
  inputPattern?: RegExp; // 输入框的校验表达式 
  inputValidator?: Function; // 输入框的校验函数。可以返回布尔值或字符串，若返回一个字符串, 则返回结果会被赋值给 inputErrorMessage 
  inputErrorMessage?: string; // 校验未通过时的提示文本 
  center?: boolean; // 是否居中布局 
  roundButton?: boolean; // 是否使用圆角按钮 
}