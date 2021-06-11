import { BaseState } from '@/admin/base/BaseVue'

interface PasswordForm {
  oldPassword: string
  password: string
  checkPassword: string
}

export default interface PasswordState extends BaseState {
  action?: string | Function // 执行的action名称
  hasOldPassword?: boolean // 是否有原密码
  data?: PasswordForm
}
