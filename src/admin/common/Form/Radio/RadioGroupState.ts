import RadioButtonState from "./RadioButtonState";
import RadioState from "./RadioState";
import { BaseState } from '@/admin/base/BaseVue'

export default interface RadioGroupState extends BaseState {
  type: string;
  value: string|number|boolean;
  size: string;
  disabled: boolean;
  textColor: string;
  fill: string;
  radio: RadioState;
  radioButton: RadioButtonState;
}
