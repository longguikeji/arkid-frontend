import ButtonState from '@/admin/common/Button/ButtonState'

export default interface ExtensionPanelState {
  name: string
  description?: string
  logo?: string
  homepage?: string
  maintainer?: string
  scope?: string
  tags?: string | string[]
  version?: string
  type?: string
  installed?: string
  enalbed?: string
  buttons?: ButtonState[]
  data?: any
}