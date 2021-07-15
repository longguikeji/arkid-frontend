import { AuthApiNode } from '@/arkfbp/nodes/authApiNode'
import { GlobalValueModule } from '@/store/modules/global-value'
import getDataByPath from '@/utils/datapath'

export class Upload extends AuthApiNode {
  async run() {
    const com = this.inputs.com
    const state = getDataByPath(com.$store.state, com.path)
    const fileData = this.inputs.data
    const file = fileData.file
    if (state.format === 'upload_file') {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e: any) => {
        com.state.value = e.target.result
      }
    } else if (state.format === 'upload_url') {
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
      state.value = GlobalValueModule.originUrl + '/api/v1/upload/render/' + outputs.key
    }
  }
}
