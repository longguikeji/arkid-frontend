import { AuthApiNode } from '@/nodes/authApiNode'
import TablePageState, { TablePage } from '@/admin/TablePage/TablePageState'
import { FlowConfig } from '@/arkfbp'

export class InitFilter extends AuthApiNode {
  async run() {
    const state = this.inputs.state as TablePageState
    const tempState = state.state as TablePage

    // filter element info
    this.url = '/api/v1/tags/'
    this.method = 'GET'
    const outputs = await super.run()
    const tagOptions = outputs.data.map(tag => {return { value: tag }})
    const typeOptions = [
      { value: 'global' },
      { value: 'tenant' }
    ]
    
    tempState.filter = {
      inline: true,
      size: 'mini',
      items: {
        tags: {
          label: '标签',
          type: 'Select',
          isSetWidth: false,
          state: {
            value: [],
            options: tagOptions,
            multiple: true
          }
        },
        type: {
          label: '类型',
          type: 'Select',
          isSetWidth: false,
          state: {
            value: [],
            options: typeOptions,
            multiple: true
          }
        },
        scope: {
          label: '作用域',
          type: 'Select',
          isSetWidth: false,
          state: {
            value: [],
            options: typeOptions,
            multiple: true
          }
        },
        action: {
          type: 'Button',
          isSetWidth: false,
          state: {
            label: '搜索',
            type: 'primary',
            action: 'fetch'
          }
        }
      }
    }

    const fetchAction = tempState.actions!.fetch
    if (fetchAction) {
      fetchAction[0] = {
        ...(fetchAction[0] as FlowConfig),
        name: 'flows/maketplace/fetch',
        request: {
          tags: 'filter.items.tags.state.value',
          type: 'filter.items.type.state.value',
          scope: 'filter.items.scope.state.value'
        }
      }
    }

    
    return {
      data: this.inputs.data,
      state: state
    }
  }
}
