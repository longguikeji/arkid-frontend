import { BaseState } from '@/admin/base/BaseVue'

export default interface DrawerState extends BaseState {
    appendToBody?: boolean; // Drawer 自身是否插入至 body 元素上。嵌套的 Drawer 必须指定该属性并赋值为 true boolean — false
    beforeClose: Function; //关闭前的回调，会暂停 Drawer 的关闭 function(done)，done 用于关闭 Drawer — —
    closeOnPressEscape: boolean; // 是否可以通过按下 ESC 关闭 Drawer boolean — true
    customClass: string; // Drawer 的自定义类名 string — —
    destroyOnClose: boolean; // 控制是否在关闭 Drawer 之后将子元素全部销毁 boolean - false
    modal: boolean; // 是否需要遮罩层 boolean — true
    modalAppendToBody: boolean; // 遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Drawer 的父元素上 boolean — true
    direction: string; // Drawer 打开的方向 Direction rtl / ltr / ttb / btt rtl
    showClose: boolean; // 是否显示关闭按钮 boolean — true
    size: string|number; // Drawer 窗体的大小, 当使用 number 类型时, 以像素为单位, 当使用 string 类型时, 请传入 'x%', 否则便会以 number 类型解释 number / string - '30%'
    title: string; //    Drawer 的标题，也可通过具名 slot （见下表）传入 string — —
    visible: boolean; // 是否显示 Drawer，支持 .sync 修饰符 boolean — false
    wrapperClosable: boolean; // 点击遮罩层是否可以关闭 Drawer boolean - true
    withHeader: boolean; // 控制是否显示 header 栏, 默认为 true, 当此项为 false 时, title attribute 和 title slot 均不生效 boolean - true
  }