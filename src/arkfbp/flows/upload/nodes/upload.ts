import { APINode } from '@/arkfbp/nodes/apiNode'
import { ConfigModule } from '@/store/modules/config'
import getStateByPath from '@/utils/state'

export class Upload extends APINode {
  async run() {
    const com = this.inputs.com
    const state = getStateByPath(com.$store.state, com.path)
    const fileData = this.inputs.data
    const file = fileData.file
    if (state.format === 'upload_file') {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e: any) => {
        com.state.value = e.target.result
      }
    } else {
      let formData = new FormData();
      formData.append("file", file)
      this.$state.commit((state) => {
        state.headers = {
          'Content-Type': 'multipart/form-data'
        }
      })
      this.params = formData
      this.url = '/api/v1/upload/'
      this.method = 'POST'
      const outputs = await super.run()
      state.value = ConfigModule.origin + '/api/v1/upload/render/' + outputs.key
    }
  }
}
