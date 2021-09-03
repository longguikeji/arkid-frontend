import { AuthApiNode } from '@/arkfbp/nodes/authApiNode'
import AdminComponentState from '@/admin/common/AdminComponent/AdminComponentState'
import { IFlow } from '@/arkfbp'
import { getButtonIcon, getButtonDefaultLabel } from '@/utils/button'

export class InitFilter extends AuthApiNode {
  async run() {
    const { state, page } = this.inputs
    const pageState: AdminComponentState = state[page]
    pageState.state.pagination = undefined
    
    this.url = '/api/v1/tags/'
    this.method = 'GET'
    const outputs = await super.run()
    const tagOptions = outputs.data.map(tag => {return { value: tag }})
    const typeOptions = [
      { value: 'global' },
      { value: 'tenant' }
    ]
    
    pageState.state.filter = {
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
            type: 'primary',
            action: 'fetch',
            icon: getButtonIcon('search'),
            tip: {
              content: '插件搜索'
            },
            circle: true
          }
        }
      }
    }

    const fetchAction = pageState.state.actions!.fetch
    if (fetchAction) {
      fetchAction[0] = {
        ...(fetchAction[0] as IFlow),
        name: 'flows/custom/maketplace/fetch',
        request: {
          tags: 'filter.items.tags.state.value',
          type: 'filter.items.type.state.value',
          scope: 'filter.items.scope.state.value'
        }
      }
    }
  }
}
