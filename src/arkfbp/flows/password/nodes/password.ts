import { Update } from '@/arkfbp/flows/update/nodes/update'
import { TenantModule } from '@/store/modules/tenant'
import { UserModule } from '@/store/modules/user'

export class Password extends Update {
  async run() {
    const { url, method, com, client } = this.inputs
    const data = client.data
    const submitData = com.formData
    const uuid = data && data.uuid ? data.uuid : UserModule.uuid
    const params = {
      old_password: submitData.oldPassword,
      password: submitData.password,
      uuid: uuid,
    }
    this.inputs.url = url + `?tenant_uuid=${TenantModule.currentTenant.uuid}`
    this.inputs.method = method
    this.inputs.params = params
    await super.run()
  }
}
