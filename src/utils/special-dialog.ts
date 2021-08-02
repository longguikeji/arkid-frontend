import { BasePage } from '@/flows/page/basePage/nodes/pageNode'
import { ITagPageAction, ITagUpdateOperation } from '@/config/openapi'
import { getSchemaByPath } from '@/utils/schema'

export function initPassword(state: BasePage, operation: ITagPageAction | ITagUpdateOperation, page: string) {
  const { path, method } = (operation as ITagUpdateOperation).write || operation
  const schema = getSchemaByPath(path, method)
  state.dialogs!.password = {
    visible: false,
    state: {
      type: 'Password',
      state: {
        action: 'password',
        hasOldPassword: !!schema.properties?.old_password
      }
    }
  }
  state.actions!.password = [
    {
      name: 'arkfbp/flows/password',
      url: path,
      method
    },
    `closePasswordDialog`
  ]
}

export function initImport(state: BasePage, operation: ITagPageAction, page: string) {
  const { path, method } = operation
  state.dialogs!.import = {
    visible: false,
    state: {
      type: 'FormPage',
      state: {
        form: {
          items: {
            file: {
              type: 'Upload',
              prop: 'file',
              label: '点击上传文件',
              state: {
                value: '',
                file: null,
                type: 'xlsx'
              }
            }
          }
        },
        buttons: [
          {
            label: '确认',
            action: 'import',
            type: 'primary'
          }
        ]
      }
    }
  }
  state.actions!.import = [
    {
      name: 'arkfbp/flows/import',
      url: path,
      method
    },
    `${page}.closeImportDialog`,
    `${page}.fetch`
  ]
}