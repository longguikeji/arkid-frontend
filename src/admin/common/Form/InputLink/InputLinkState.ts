import InputState from '../Input/InputState'

export default interface InputLinkState extends InputState {
  action?: string | Function
  file?: File
}