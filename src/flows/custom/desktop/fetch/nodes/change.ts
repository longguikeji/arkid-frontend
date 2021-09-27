import { APINode } from '@/arkfbp/nodes/apiNode'
import { UserModule } from '@/store/modules/user'

export class ChangeStateNode extends APINode {

  async run() {
    const { state, apps, com } = this.inputs

    // get app set data
    this.url = '/api/v1/user/appdata/'
    this.method = 'GET'
    const res = await super.run()
    const positions = res.data

    // save apps for headers search function
    UserModule.setUserApps(apps)

    // set manager button
    const button = state.card.buttons[0]
    if (apps && apps.length > 0) {
      button.disable = false
    } else {
      button.disable = true
    }

    // get manager page state
    const appManagerState = com.getAnyPageState('manager')
    const items = appManagerState.state.form.items
    items.check = {
      type: 'CheckBoxGroup',
      state: {
        value: [],
        items: []
      }
    }
    const checkBox = items.check.state.items

    // set app state for desktop
    let x = 0, y = 0
    apps.forEach((app, index) => {
      y = Math.floor(index / 3)
      let position
      if (positions) {
        position = positions.filter(p => p.uuid === app.uuid)[0]
      }
      const item = {
        type: 'CardPanel',
        state: app,
        position: {
          x: position ? position.x : x,
          y: position ? position.y : y,
          w: 1.5,
          h: 0.7,
          i: position ? position.i : index
        }
      }
      state.items.push(item)

      // check manager
      checkBox.push({
        value: app.uuid,
        label: app.name,
        checked: true
      })
    })
  }
}
