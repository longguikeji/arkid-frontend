import { BasePage } from '@/flows/page/basePage/nodes/pageNode'
import { ITagPageAction, ITagUpdateOperation } from '@/config/openapi'
import { getSchemaByPath } from '@/utils/schema'

export function addInputListDialog() {

}

export function addPasswordDialog(adminState: any, state: BasePage, operation: ITagUpdateOperation | ITagPageAction, page: string) {
  const { path, method } = (operation as ITagUpdateOperation).write || operation
  const schema = getSchemaByPath(path, method)
  adminState.password = {
    type: 'Password',
    state: {
      action: `${page}.password`,
      hasOldPassword: !!schema.properties?.old_password
    }
  }
  state.dialogs!.password = {
    visible: false,
    page: 'password'
  }
  state.actions!.password = [
    {
      name: 'arkfbp/flows/password',
      url: path,
      method
    },
    'closePasswordDialog'
  ]
}

export function addImportDialog(adminState: any, state: BasePage, operation: ITagPageAction, page: string) {
  const { path, method } = operation
  adminState.import = {
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
      ],
      actions: {
        import: [
          {
            name: 'arkfbp/flows/import',
            url: path,
            method
          },
          `${page}.closeImportDialog`,
          `${page}.fetch`
        ]
      }
    }
  }
  state.dialogs!.import = {
    visible: false,
    page: 'import'
  }
}