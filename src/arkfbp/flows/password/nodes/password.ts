import { Update } from '@/arkfbp/flows/update/nodes/update'
import { UserModule } from '@/store/modules/user'
import { FlowModule } from '@/store/modules/flow'
import { error } from '@/constants/error'

export class Password extends Update {
  async run() {
    const { url, method, com } = this.inputs
    const data = com.formData
    const params = {
      old_password: data.oldPassword,
      password: data.password,
      uuid: UserModule.uuid
    }
    this.inputs.url = url
    this.inputs.method = method
    this.inputs.params = params
    const outputs = await super.run()
    if (outputs.error) {
      FlowModule.stopRunFlow()
      com.$message({
        message: error[outputs.error],
        type: 'error',
        showClose: true,
      })
    }
  }
}
