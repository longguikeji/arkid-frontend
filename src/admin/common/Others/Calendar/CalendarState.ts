import { BaseState } from '@/admin/base/BaseVue'

export default interface CalendarState extends BaseState {
  value: Date|string|number; // 绑定值 Date/string/number — —
  range?: Array<string>; //时间范围，包括开始时间与结束时间。开始时间必须是周一，结束时间必须是周日，且时间跨度不能超过两个月。 Array — —
  firstDayOfWeek: number; // 周起始日 Number 1 到 7 1
}
