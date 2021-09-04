import { AuthApiNode } from '@/arkfbp/nodes/authApiNode'

export class Position extends AuthApiNode {

  async run() {
    this.url = '/api/v1/user/appdata/'
    this.method = 'GET'
    const res = await super.run()
    this.$state.commit(state => {
      state.items = res.data
    })
  }

}
