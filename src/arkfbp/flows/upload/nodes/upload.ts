import { AuthApiNode } from '@/nodes/authApiNode'

export class Upload extends AuthApiNode {
  async run() {
    const path = this.inputs.com.path
    const state = this.getState(path)
    if (state.file) {
      let formData = new FormData();
      formData.append("file", state.file);
      this.params = formData
      this.url = '/api/v1/upload/'
      this.method = 'POST'
      const outputs = await super.run()
      state.value = outputs
    }
  }
}
