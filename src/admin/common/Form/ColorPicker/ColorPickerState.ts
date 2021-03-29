import { BaseState } from '@/admin/base/BaseVue'

export default interface ColorPickerState extends BaseState {
  value: string;
  disabled: boolean; //是否禁用
  size: string; // 尺寸 string — medium / small / mini
  showAlpha: boolean; // 是否支持透明度选择 boolean — false
  colorFormat: string; // 写入 v-model 的颜色的格式 string hsl / hsv / hex / rgb hex（show-alpha 为 false）/ rgb（show-alpha 为 true）
  popperClass: string; // ColorPicker 下拉框的类名 string — —
  predefine: Array<string>; // 预定义颜色 array — —
}
