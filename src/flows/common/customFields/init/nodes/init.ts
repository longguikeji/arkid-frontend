import { FunctionNode } from 'arkfbp/lib/functionNode'

export class InitCustomFieldsNode extends FunctionNode {
    async run() {
      const data = this.inputs
      const com = this.$state.fetch().inputs.com
      const values = com.state.data
      if (data.results) {
        data.results.forEach(item => {
          const name = item.name
          if (name) {
            com.$set(com.state.items, name, {
              label: name,
              prop: name,
              type: 'Input',
              state: {
                value: values[name],
                placeholder: `请输入${name}`
              }
            })
          }
        })
      }
    }
}
