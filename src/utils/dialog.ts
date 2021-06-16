import DialogState from '@/admin/common/Others/Dialog/DialogState'
import { getSchemaByPath, getApiRoles } from '@/utils/schema'
import generateForm from '@/utils/form'
import { IPage} from '@/flows/basePage/nodes/pageNode'
import generateAction from '@/utils/generate-action'
import ButtonState from '@/admin/common/Button/ButtonState'
import { ITagPageAction, ITagInitUpdateAction } from '@/config/openapi'
import { UserModule } from '@/store/modules/user'

const BUTTON_LABEL = {
  create: '创建',
  import: '导入',
  export: '导出',
  update: '编辑',
  delete: '删除',
  retrieve: '查看',
  password: '修改密码'
}

const BUTTON_TYPE = {
  create: 'primary',
  import: 'primary',
  export: 'primary',
  update: 'primary',
  delete: 'danger',
  retrieve: 'info',
  password: 'primary'
}

const DIALOG_TYPE = {
  create: 'FormPage',
  import: 'Upload',
  update: 'FormPage',
  retrieve: 'FormPage',
  password: 'Password'
}

const PAGE_ACTION_NAME = {
  create: 'openCreateDialog',
  import: 'openImportDialog',
  export: 'export',
  update: 'openUpdateDialog',
  delete: 'delete',
  retrieve: 'openRetrieveDialog',
  password: 'openPasswordDialog'
}

const PAGE_ACTION_FLOW = {
  create: 'arkfbp/flows/assign',
  import: 'arkfbp/flows/assign',
  export: 'arkfbp/flows/export',
  update: 'arkfbp/flows/fetch',
  retrieve: 'arkfbp/flows/fetch',
  password: 'arkfbp/flows/assign'
}

const DIALOG_ACTION_NAME = {
  create: 'create',
  import: 'import',
  update: 'update',
  password: 'password'
}

const DIALOG_ACTION_FLOW = {
  create: 'arkfbp/flows/update',
  import: 'arkfbp/flows/import',
  update: 'arkfbp/flows/update',
  password: 'arkfbp/flows/password'
}

// key 主要读取btn按钮的label和style, pageType会影响btn按钮的type的是text或其他
export function generateButton(key: string, path: string, method: string, pageType?: string, isDialog?: boolean): ButtonState | null {
  const apiRoles = getApiRoles(path, method)
  const userRole = UserModule.role
  if (!apiRoles.includes(userRole)) return null
  const btn: ButtonState = {
    label: BUTTON_LABEL[key],
    action: isDialog ? DIALOG_ACTION_NAME[key] : PAGE_ACTION_NAME[key],
    type: (pageType === 'TreePage' && (key === 'update' || key === 'delete')) ? 'text' : BUTTON_TYPE[key],
    disabled: key === 'export' ? true : false,
  }
  return btn
}

export function generateDialogState(path: string, method: string, key: string, showReadOnly: boolean = false ): DialogState | null {
  const dialogType = DIALOG_TYPE[key]
  if (!dialogType) return null
  const schema = getSchemaByPath(path, method)
  const dialogState: DialogState = {}
  dialogState.title = BUTTON_LABEL[key]
  dialogState.visible = false
  dialogState.data = {}
  const btn = generateButton(key, path, method, '', true)
  if (!btn) return null
  if (!dialogState.buttons?.length) dialogState.buttons = []
  if (dialogType === 'Password') {
    dialogState.isCancelFooter = true
  } else {
    dialogState.buttons.push(btn)
  }
  switch (dialogType) {
    case 'FormPage':
      dialogState.state = {
        type: 'FormPage',
        state: generateForm(schema, showReadOnly)
      }
      break
    case 'Upload':
      dialogState.state = {
        type: 'Upload',
        state: {
          type: 'xlsx'
        }
      }
      break
    case 'Password':
      dialogState.state = {
        type: 'Password',
        state: {
          action: 'password',
          hasOldPassword: isFillOldPassword(path, method)
        }
      }
  }
  return dialogState
}

export function addDialogAction(state: IPage, path: string, method: string, key: string) {
  const actionName = DIALOG_ACTION_NAME[key]
  const flowName = DIALOG_ACTION_FLOW[key]
  if (actionName) {
    if (key === 'import') {
      const request = {}
      request['data'] = 'dialogs.import.state.state.file'
      state.actions![actionName] = [
        {
          name: flowName,
          url: path,
          method: method,
          request: request
        }
      ]
    } else {
      const target = `dialogs.${key}.state.state.`
      const isResponse = false
      const { mapping, required } = generateAction(path, method, target, isResponse)
      state.actions![actionName] = [
        {
          name: flowName,
          url: path,
          method: method,
          request: mapping,
          required: required
        },
        {
          name: 'arkfbp/flows/assign',
          response: {
            [`dialogs.${key}.visible`]: false
          }
        },
        'fetch'
      ]
    }
  }
}

export function addItemAction(state: IPage, path: string, method: string, key: string) {
  const actionName = PAGE_ACTION_NAME[key]
  const flowName = PAGE_ACTION_FLOW[key]
  if (flowName) {
    let response = {
      [`dialogs.${key}.data`]: '',
    }
    const target = `dialogs.${key}.state.state.` 
    const isResponse = true 
    const { mapping } = generateAction(path, method, target, isResponse)
    response = Object.assign(response, mapping)
    state.actions![actionName] = [
      {
        name: 'arkfbp/flows/assign',
        response: {
          [`dialogs.${key}.visible`]: true
        }
      }
    ]
    if (method.toUpperCase() === 'GET') {
      state.actions![actionName].unshift({
        name: flowName,
        url: path,
        method: method,
        response: response
      })
    }
  } else {
    state.actions![actionName] = [
      {
        name: 'arkfbp/flows/update',
        url: path,
        method: method
      },
      'fetch'
    ]
  }
}

export function addCardAction(state: IPage, path: string, method: string, key: string) {
  const actionName = PAGE_ACTION_NAME[key]
  const flowName = PAGE_ACTION_FLOW[key]
  if (key === 'export') {
    state.actions![actionName] = [
      {
        name: flowName,
        url: path,
        method: method
      }
    ]
  } else {
    const target = `dialogs.${key}.state.state.` 
    const isResponse = true
    const isEmpty = true
    const { mapping } = generateAction(path, method, target, isResponse, isEmpty)
    state.actions![actionName] = [
      {
        name: flowName,
        response: {
          [`dialogs.${key}.visible`]: true,
          ...mapping
        }
      }
    ]
  }
}

export function addSortAction(state: IPage, action: ITagInitUpdateAction | ITagPageAction) {
  if (!action) return
  Object.keys(action).forEach((sortName) => {
    const url = action[sortName].path
    const method = action[sortName].method
    const actionName = 'sortBy' + sortName
    state.actions![actionName] = [
      {
        name: 'arkfbp/flows/sort',
        url: url,
        method: method
      },
      'fetch'
    ]
    if (sortName === 'batch') {
      state.actions![actionName][0]['request'] = {
        idps: {
          key: 'uuid',
          data: 'table.data'
        }
      }
    }
  })
}

export function addChildrenAction(state: IPage, path: string, method: string) {
  state.tree!.action = 'fetchTreeNode'
  state.actions!.fetchTreeNode = [
    {
      name: "arkfbp/flows/fetchTreeNode",
      url: path,
      method: method
    }
  ]
}

export function isFillOldPassword(path: string, method: string): boolean {
  let isFill = false
  const schema = getSchemaByPath(path, method)
  if (schema.properties?.old_password) {
    isFill = true
  }
  return isFill
}
