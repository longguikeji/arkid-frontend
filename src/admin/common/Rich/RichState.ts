import { BaseState } from '@/admin/base/BaseVue'

export default interface RichState extends BaseState {
  value: string
  id?: string
  height?: string
  width?: string
  toolbar?: string[]
  menubar?: string
  isDisabledUploadImage?: boolean
  disabled?: boolean
}
