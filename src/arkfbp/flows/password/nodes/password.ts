import { Update } from '@/arkfbp/flows/update/nodes/update'
import { TenantModule } from '@/store/modules/tenant'
import { UserModule } from '@/store/modules/user'
import { FlowModule } from '@/store/modules/flow'

export class Password extends Update {
  async run() {
    const { url, method, com } = this.inputs
    const data = FlowModule.data
    const submitData = com.formData
    let uuid = UserModule.uuid
    const action = com.state.action
    if (action) {
      const page = action.split('.')[0]
      if (data[page]?.uuid) {
        uuid = data[page].uuid
      }
    }
    const params = {
      old_password: submitData.oldPassword,
      password: submitData.password,
      uuid: uuid,
      tenant_uuid: TenantModule.currentTenant.uuid
    }
    this.inputs.url = url
    this.inputs.method = method
    this.inputs.params = params
    await super.run()
  }
}
