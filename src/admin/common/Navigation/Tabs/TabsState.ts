import TabPaneState from './TabPaneState'
import { BaseState } from '@/admin/base/BaseVue'

export default interface TabsState extends BaseState {
  value?: string; // 绑定值，选中选项卡的 name  默认值 第一个选项卡的 name
  type?: string; // 风格类型 card/border-card 
  items: TabPaneState[]; // tab-pane 的数据
  closable?: boolean; // 标签是否可关闭  false
  addable?: boolean; // 标签是否可增加  false
  editable?: boolean; // 标签是否同时可增加和关闭 
  tabPosition?: string; // 选项卡所在位置 top/right/bottom/left  默认值 top
  stretch?: boolean; // 标签的宽度是否自撑开 false
  beforeLeave?: Function; // 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。   
}