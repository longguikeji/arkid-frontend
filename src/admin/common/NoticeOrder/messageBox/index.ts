import { MessageBox as MsgBox } from 'element-ui';
import MessageBoxState from './MessageBoxState';

export function MessageBox(type: string, inputs: MessageBoxState) {
  switch (type) {
    case "alert":
      // @ts-ignore
      MsgBox.alert(inputs)
      break
    case "confirm":
      // @ts-ignore
      MsgBox.confirm(inputs)
      break
    case "prompt":
      // @ts-ignore
      MsgBox.prompt(inputs)
      break
    default:
      // @ts-ignore
      MsgBox(inputs)
  }
}