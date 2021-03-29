import { Notification as Notify } from 'element-ui';
import NotificationState from './NotificationState'

export default function Notification(inputs: NotificationState) {
  // @ts-ignore
  Notify(inputs)
}