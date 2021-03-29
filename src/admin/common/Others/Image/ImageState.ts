import { BaseState } from '@/admin/base/BaseVue'

export default interface ImageState extends BaseState {
  value?: string; // 图片源，同原生 string — -
  fit: string; // 确定图片如何适应容器框，同原生 object-fit string fill / contain / cover / none / scale-down -
  alt: string; // 原生 alt string - -
  referrerPolicy: string; // 原生 referrerPolicy string - -
  lazy: boolean; // 是否开启懒加载 boolean — false
  scrollContainer: string; // 开启懒加载后，监听 scroll 事件的容器 string / HTMLElement — 最近一个 overflow 值为 auto 或 scroll 的父元素
  previewSrcList: Array<string>; // 开启图片预览功能 Array — -
  zIndex: number; // 设置图片预览的 z-index Number — 2000
}
