import { Update } from '@/arkfbp/flows/update/nodes/update'
import { TenantModule } from '@/store/modules/tenant'
import { UserModule } from '@/store/modules/user'

export class Password extends Update {
  async run() {
    const { url, method, com } = this.inputs
    const data = com.formData
    const uuid = this.inputs.client.dialogs?.password?.data?.uuid || UserModule.uuid
    const params = {
      old_password: data.oldPassword,
      password: data.password,
      uuid: uuid,
      tenant_uuid: TenantModule.currentTenant.uuid
    }
    this.inputs.url = url
    this.inputs.method = method
    this.inputs.params = params
    await super.run()
  }
}
