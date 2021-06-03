import { StateNode } from '@/nodes/stateNode'

export class OpenAuthPage extends StateNode {
  async run() {
    const com = this.inputs.com
    const router = com.$router
    const data = com.state.data
    const { href } = router.resolve({
      name: 'auth',
      query: {
        uuid: data.uuid,
        authorize: data.data.authorize
      }
    })
    window.open(href, '_blank')
  }
}
