import CardState from '../common/Card/CardState'
import FormState from '../common/Form/FormState'
import SelectState from '../common/Form/Select/SelectState'
import ButtonState from '@/admin/common/Button/ButtonState' 
import DialogState from '@/admin/common/Others/Dialog/DialogState'

export default interface FromPageState extends CardState {
  form?: FormState
  dialogs?: { [dialogName: string]: DialogState }

  select?: SelectState
  forms?: {[value:string]: FormState}
  buttons?: Array<ButtonState> // form 结构中的底部按钮内容
}
