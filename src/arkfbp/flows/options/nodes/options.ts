import { APINode } from '@/arkfbp/nodes/apiNode'
import { TenantModule } from '@/store/modules/tenant'

export class OptionsNode extends APINode {
  async run() {
    let { com, url } = this.inputs
    url = url.replace('{tenant_uuid}', TenantModule.currentTenant.uuid)
    const { state, path, getAnyStateByPath } = com
    const prop = state.prop
    const cstate = getAnyStateByPath(path.replace(prop, 'major_auth'))
    url = url.replace('{major_auth}', cstate.value)
    this.url = url.replace('http://localhost:8000', '')
    this.method = 'GET'
    const outputs = await super.run()
    const results = outputs.results
    if (results?.length) {
      state.options.length = 0
      results.forEach(item => {
        state.options.push({
          value: item.value,
          label: item.name
        })
      })
    }
  }
}
