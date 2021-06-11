import { AuthApiNode } from '@/arkfbp/nodes/authApiNode'
import { getOriginUrl } from '@/utils/cookies'
import getDataByPath from '@/utils/datapath'

export class Upload extends AuthApiNode {
  async run() {
    const com = this.inputs.com
    const state = getDataByPath(com.$store.state, com.path)
    if (state.file) {
      let formData = new FormData();
      formData.append("file", state.file);
      this.$state.commit((state) => {
        state.headers = {
          'Content-Type': 'multipart/form-data'
        }
      })
      this.params = formData
      this.url = '/api/v1/upload/'
      this.method = 'POST'
      const outputs = await super.run()
      state.value = getOriginUrl() + '/api/v1/upload/render/' + outputs.key
    }
  }
}
