import { FunctionNode } from 'arkfbp/lib/functionNode'

export class InitCustomFieldsNode extends FunctionNode {
    async run() {
      const data = this.inputs
      const com = this.$state.fetch().inputs.com
      const values = com.state.data
      if (data.results) {
        const items = com.state.items
        data.results.forEach(item => {
          const { name, is_visible } = item
          if (name && is_visible && !items[name]) {
            com.$set(items, name, {
              label: name,
              prop: name,
              type: 'Input',
              state: {
                value: values[name] || undefined,
                placeholder: `请输入${name}`
              }
            })
          }
        })
      }
    }
}
