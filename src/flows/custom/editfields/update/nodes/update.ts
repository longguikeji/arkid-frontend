import { Update } from '@/arkfbp/flows/update/nodes/update'

export class UpdateEditFieldsNode extends Update {
  async run() {
    const { com } = this.inputs
    const state = com.$store.state?.admin?.adminState['profile_config_editfields.update'].state
    if (state) {
      this.inputs.required = undefined
      const data = state.table.data
      const selected = state.table.selection.values
      const selectedData = {}
      if (selected) {
        selected.map(s => {
          const name = s.name || s.en_name
          if (name) {
            selectedData[name] = s
          }
        })
      }
      data.forEach(item => {
        const name = item.name || item.en_name
        if (selectedData[name]) {
          item = selectedData[name]
        } else {
          item = Object.assign(item, { is_select: false })
        }
      })
      this.inputs.params = {
        results: data
      }
      await super.run()
    }
  }
}
