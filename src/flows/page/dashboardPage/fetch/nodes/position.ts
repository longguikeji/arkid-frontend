import { APINode } from '@/arkfbp/nodes/apiNode'

export class Position extends APINode {

  async run() {
    if (this.inputs) {
      const { page } = this.inputs
      if (page === 'statistics') return
    }
    this.url = '/api/v1/user/appdata/'
    this.method = 'GET'
    const res = await super.run()
    this.$state.commit(state => {
      state.items = res.data
    })
  }

}
