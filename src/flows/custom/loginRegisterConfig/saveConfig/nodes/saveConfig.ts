import { FunctionNode } from 'arkfbp/lib/functionNode'
import { ConfigModule } from '@/store/modules/config'

export class SaveConfig extends FunctionNode {
  async run() {
    const client = this.inputs.client
    const data = client.form?.items?.data?.state?.data
    if (data) {
      ConfigModule.setTenantConfig({
        closePageAutoLogout: data.close_page_auto_logout,
        uploadFileFormat: data.upload_file_format
      })
    }
  }
}