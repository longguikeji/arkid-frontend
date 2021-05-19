import { AuthApiNode } from '@/arkfbp/nodes/authApiNode'

export class Import extends AuthApiNode {
  async run() {
    const data = this.inputs.params.data
    if (!data || !data.raw) {
      throw Error('import file is empty')
    }
    this.url = this.inputs.url
    this.method = this.inputs.method
    let formData = new FormData()
    formData.append("file", data.raw)
    this.params = formData
    await super.run()
  }
}
