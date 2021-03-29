import { Message as Msg } from 'element-ui';
import MessageState from './MessageState';

export default function Message(inputs: MessageState) {
  // @ts-ignore
  return Msg(inputs)
}
