import { APINode } from '@/arkfbp/nodes/apiNode'
import { UserModule } from '@/store/modules/user'
import { TenantModule } from '@/store/modules/tenant'

export class ChangeStateNode extends APINode {

  async run() {
    const { results, source } = this.inputs
    const { client } = source

    // set app position
    let data: string[] = []
    const uuid = TenantModule.currentTenant.uuid
    if (uuid) {
      this.url = `/api/v1/tenant/${uuid}/user_app_data/`
      this.method = 'GET'
      const res = await super.run()
      data = res.data || []
    }

    // save for headers search function
    UserModule.setUserApps(results || [])

    // set desktop apps panel -- cardpanel
    if (results && results.length) {
      const firstArr = new Array()
      const secondArr = new Array()
      results.forEach((app: any) => {
        const uuid = app.uuid
        const index = data.indexOf(uuid)
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
