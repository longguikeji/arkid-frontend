import { BaseState } from '@/admin/base/BaseVue'

export default interface TimelineState extends BaseState {
  data: object;
  reverse: boolean; //指定节点排序方向，默认为正序 boolean — false
  timestamp: string; // 时间戳 string - —
  hideTimestamp: boolean; // 是否隐藏时间戳 boolean — false
  placement: string; // 时间戳位置 string top / bottom bottom
  type: string; // 节点类型 string primary / success / warning / danger / info -
  color: string; // 节点颜色 string hsl / hsv / hex / rgb -
  size: string; //节点尺寸 string normal / large normal
  icon: string; // 节点图标 string — -
}
