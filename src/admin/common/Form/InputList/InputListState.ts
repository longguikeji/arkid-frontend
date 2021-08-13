import SelectState from '../Select/SelectState'

export default interface InputListState extends SelectState {
  field?: string
  page: string
  link?: string
}
