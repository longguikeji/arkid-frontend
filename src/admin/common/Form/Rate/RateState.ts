import { BaseState } from '@/admin/base/BaseVue'

export default interface RateState extends BaseState {
  value: number;
  max: number; //最大值
  disabled: boolean; //是否禁用
  allowHalf: boolean; // 是否允许半选 boolean — false
  lowThreshold: number; // 低分和中等分数的界限值，值本身被划分在低分中 number — 2
  highThreshold: number; // 高分和中等分数的界限值，值本身被划分在高分中 number — 4
  colors: Array<string>|object; //icon 的颜色。若传入数组，共有 3 个元素，为 3 个分段所对应的颜色；若传入对象，可自定义分段，键名为分段的界限值，键值为对应的颜色 array/object — ['#F7BA2A', '#F7BA2A', '#F7BA2A']
  voidColor: string; // 未选中 icon 的颜色 string — #C6D1DE
  disabledVoidColor: string; // 只读时未选中 icon 的颜色 string — #EFF2F7
  iconClasses: Array<string>|object; //icon 的类名。若传入数组，共有 3 个元素，为 3 个分段所对应的类名；若传入对象，可自定义分段，键名为分段的界限值，键值为对应的类名 array/object — ['el-icon-star-on', 'el-icon-star-on','el-icon-star-on']
  voidIconClass: string; //未选中 icon 的类名 string — el-icon-star-off
  disabledVoidIconClass: string; // 只读时未选中 icon 的类名 string — el-icon-star-on
  showText: boolean; // 是否显示辅助文字，若为真，则会从 texts 数组中选取当前分数对应的文字内容 boolean — false
  showScore: boolean; // 是否显示当前分数，show-score 和 show-text 不能同时为真 boolean — false
  textColor: string; // 辅助文字的颜色 string — #1F2D3D
  texts: Array<string>; // 辅助文字数组 array — ['极差', '失望', '一般', '满意', '惊喜']
  scoreTemplate: string; // 分数显示模板 string — {value}
}
