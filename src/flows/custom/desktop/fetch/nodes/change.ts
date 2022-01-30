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
    const data = res.data || []

    // save for headers search function
    UserModule.setUserApps(results || [])

    // set desktop apps panel -- cardpanel
    if (results && results.length) {
      const firstArr = new Array()
      const secondArr = new Array()
      results.forEach(app => {
        const uuid = app.uuid
        const index = data.indexOf(uuid)
        // TODO: auto_form_fill type app
        // if (app.type === 'auto_form_fill') {
        //   app.action = "selectAccount";
        // }
        if (index !== -1) {
          firstArr[index] = {
            type: "CardPanel",
            state: app,
          };
        } else {
          secondArr.push({
            type: 'CardPanel',
            state: app,
          })
        }
      })
      client.items = firstArr.concat(secondArr)
    }
  }
}
