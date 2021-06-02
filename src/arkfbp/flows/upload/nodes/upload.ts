import { AuthApiNode } from '@/nodes/authApiNode'
import { getOriginUrl } from '@/utils/cookies'

export class Upload extends AuthApiNode {
  async run() {
    const path = this.inputs.com.path
    const state = this.getState(path)
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
