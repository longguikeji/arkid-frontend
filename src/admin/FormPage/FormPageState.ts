import CardState from '../common/Card/CardState'
import FormState from '../common/Form/FormState'
import SelectState from '../common/Form/Select/SelectState'
import ButtonState from '@/admin/common/Button/ButtonState' 
import DialogState from '@/admin/common/Others/Dialog/DialogState'
import { FlowConfig } from '@/arkfbp'

export interface FormPage extends CardState {
  form?: FormState
  dialogs?: { [dialogName: string]: DialogState }
  card?: CardState
  select?: SelectState
  forms?: {[value:string]: FormState}
  bottomButtons?: Array<ButtonState> // form 结构中的底部按钮内容
  actions?: { [name: string]: (FlowConfig | string)[] }
}

export default interface FromPageState {
  type?: string // FormPage
  state?: FormPage
}