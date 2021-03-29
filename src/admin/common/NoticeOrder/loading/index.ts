import { Loading as Load } from 'element-ui'
import LoadingState from './LoadingState'

export function Loading(inputs: LoadingState) {
  const loading = Load.service(inputs)
  return loading
}
