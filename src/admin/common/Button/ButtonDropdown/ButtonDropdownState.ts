import SelectState from '@/admin/common/Form/Select/SelectState'
import ButtonState from '../ButtonState'

export default interface ButtonDropdownState extends SelectState {
  buttons: ButtonState[]
}
