import { BaseState } from '@/admin/base/BaseVue'

export default interface CarouselState extends BaseState {
  height: string; // 走马灯的高度 string — —
  initialIndex: number; // 初始状态激活的幻灯片的索引，从 0 开始 number — 0
  trigger: string; // 指示器的触发方式 string click —
  autoplay: boolean; // 是否自动切换 boolean — true
  interval: number; // 自动切换的时间间隔，单位为毫秒 number — 3000
  indicatorPosition: string; // 指示器的位置 string outside/none —
  arrow: string; // 切换箭头的显示时机 string always/hover/never hover
  type: string; // 走马灯的类型 string card —
  loop: boolean; // 是否循环显示 boolean - true
  direction: string; // 走马灯展示的方向 string horizontal/vertical horizontal

  data:object;
  name: string; // 幻灯片的名字，可用作 setActiveItem 的参数 string — —
  label: string; // 该幻灯片所对应指示器的文本 string — —
  width:string;
}
