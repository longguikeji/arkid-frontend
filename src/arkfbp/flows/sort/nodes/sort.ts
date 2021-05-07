import { AuthApiNode } from '@/nodes/authApiNode'

export class Sort extends AuthApiNode {
  async run() {
    this.url = this.inputs.url
    this.method = this.inputs.method
    if (!this.url) {
      throw Error('tablePage sort flow is not url')
    }
    const params = this.inputs.params
    if (params) {
      Object.keys(params).forEach(key => {
        params[key] = Object.keys(params[key]).map((i) => {
          return params[key][i]
        })
      })  
      this.params = params
    }  
    await super.run()
  }
}
