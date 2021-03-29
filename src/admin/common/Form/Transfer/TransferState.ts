import { BaseState } from '@/admin/base/BaseVue'

export default interface TransferState extends BaseState {
  value: Array<any>;
  data: Array<any>; //Transfer 的数据源 array[{ key, label, disabled }] — [ ]
  filterable: boolean; // 是否可搜索 boolean — false
  filterPlaceholder: string; // 搜索框占位符 string — 请输入搜索内容
  filterMethod: Function; // 自定义搜索方法 function — —
  targetOrder: string; // 右侧列表元素的排序策略：若为 original，则保持与数据源相同的顺序；若为 push，则新加入的元素排在最后；若为 unshift，则新加入的元素排在最前 string original / push / unshift original
  titles: Array<string>; // 自定义列表标题 array — ['列表 1', '列表 2']
  buttonTexts: Array<string>; //自定义按钮文案 array — [ ]
  renderContent: Function; // 自定义数据项渲染函数 function(h, option) — —
  format: object; // 列表顶部勾选状态文案 object{noChecked, hasChecked} — { noChecked: '${checked}/${total}', hasChecked: '${checked}/${total}' }
  props: object; // 数据源的字段别名 object{key, label, disabled} — —
  leftDefaultChecked: Array<string>; // 初始状态下左侧列表的已勾选项的 key 数组 array — [ ]
  rightDefaultChecked: Array<string>; // 初始状态下右侧列表的已勾选项的 key 数组 array — [ ]
}
