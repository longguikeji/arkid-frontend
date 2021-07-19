import CardState from '../common/Card/CardState'
import FormState from '../common/Form/FormState'
import SelectState from '../common/Form/Select/SelectState'
import ButtonState from '@/admin/common/Button/ButtonState' 
import DialogState from '@/admin/common/Others/Dialog/DialogState'
import { IFlow } from '@/arkfbp'

export interface FormPage extends CardState {
  name?: string
  form?: FormState
  dialogs?: { [dialogName: string]: DialogState }
  card?: CardState
  select?: SelectState
  forms?: {[value:string]: FormState}
  bottomButtons?: Array<ButtonState>
  actions?: { [name: string]: (IFlow | string)[] }
  data?: any
}