import AdminComponentState from '../../AdminComponent/AdminComponentState'

export default interface DialogState extends AdminComponentState {
  title?: string // 标题
  data?: Object // 对话框每一项的值
  actions?: Array<any> // 底部按钮对应的事件
  visible?: boolean // 弹出框的显示与隐藏
  type?: string // 判断Dialog的类型 是 TablePage 还是 FormPage 还是 Tree 结构
  width?: string // Dialog 的宽度
  fullscreen?: boolean // 是否为全屏 Dialog
  top?: string // Dialog CSS 中的 margin-top 值
  modal?: boolean // 是否需要遮罩层
  modalAppendToBody?: boolean // 遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Dialog 的父元素上
  appendToBody?: boolean // Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true
  lockScroll?: boolean // 是否在 Dialog 出现时将 body 滚动锁定
  customClass?: string // Dialog 的自定义类名
  closeOnClickModal?: boolean // 是否可以通过点击 modal 关闭 Dialog
  closeOnPressEscape?: boolean // 是否可以通过按下 ESC 关闭 Dialog
  showClose?: boolean // 是否显示关闭按钮
  beforeClose?: Function // 关闭前的回调，会暂停 Dialog 的关闭
  center?: boolean // 是否对头部和底部采用居中布局
  destroyOnClose?: boolean // 关闭时销毁 Dialog 中的元素
  reliantValues?: any // 对话框所依赖的其他数据值的集合
  cancelButtonSize?: string
}
