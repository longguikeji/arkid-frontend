import { APINode } from "@/arkfbp/nodes/apiNode"
import { FlowModule } from "@/store/modules/flow";

export class SelectAccountNode extends APINode {
  async run() {
    const { url, method, com, client } = this.inputs
    const state = com.state
    if (!state && !state.uuid) return
    this.url = `${url}?app_uuid=${state.uuid}`
    this.method = method
    const outputs = await super.run()
    const results = outputs?.results
    if (!results) return

    const selectAccountState = com.getAnyPageState('selectAccount');
    const items = selectAccountState?.items;
    if (!items) return

    items.length = 0
    for (const item of results) {
      const newUrl = `${state.url}?app_uuid=${state.uuid}&username=${item.username}`
      if (results.length === 1) {
        window.open(newUrl, '_blank')
      } else {
        items.push({
          label: item.username,
          value: newUrl,
          data: {
            url: newUrl,
          }
        })
      }
    }

    // run or stop
    if (items.length === 0) {
      FlowModule.stopRunFlow()
    }
  }
}
