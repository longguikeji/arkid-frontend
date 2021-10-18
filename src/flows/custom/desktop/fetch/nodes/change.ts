import { APINode } from '@/arkfbp/nodes/apiNode'
import { UserModule } from '@/store/modules/user'

export class ChangeStateNode extends APINode {

  async run() {
    const { results, source } = this.inputs
    const { client } = source

    // set app position
    this.url = '/api/v1/user/appdata/'
    this.method = 'GET'
    const res = await super.run()
    const data = res.data

    // save for headers search function
    UserModule.setUserApps(results)

    // set manager button
    const button = client.card.buttons[0]
    if (results && results.length > 0) {
      button.disable = false
    } else {
      button.disable = true
    }

    // set desktop apps panel -- cardpanel
    if (data) {
      const firstArr = new Array()
      const secondArr = new Array()
      data.forEach(uuid => {
        const app = results.filter(result => result.uuid === uuid)[0]
        if (app) {
          firstArr.push(app)
        } else {
          secondArr.push(app)
        }
      })
      client.board.list = firstArr.concat(secondArr)
    } else {
      client.board.list = results
    }
    
  }
}
