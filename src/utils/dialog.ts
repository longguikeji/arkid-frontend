import DialogState from '@/admin/common/Others/Dialog/DialogState'
import { getSchemaByPath } from '@/utils/schema'
import generateForm from '@/utils/form'
import { BasePage } from '@/flows/basePage/nodes/pageNode'
import generateAction from '@/utils/generate-action'

const BUTTON_LABEL = {
  create: '创建',
  import: '导入',
  export: '导出',
  update: '编辑',
  delete: '删除',
  retrieve: '查看'
}

const BUTTON_TYPE = {
  create: 'primary',
  import: 'primary',
  export: 'primary',
  update: 'primary',
  delete: 'danger',
  retrieve: 'info'
}

const DIALOG_TYPE = {
  create: 'FormPage',
  import: 'Upload',
  update: 'FormPage',
  retrieve: 'FormPage'
}

const PAGE_ACTION_NAME = {
  create: 'openCreateDialog',
  import: 'openImportDialog',
  export: 'export',
  update: 'openUpdateDialog',
  delete: 'delete',
  retrieve: 'openRetrieveDialog'
}

const PAGE_ACTION_FLOW = {
  create: 'arkfbp/flows/assign',
  import: 'arkfbp/flows/assign',
  export: 'arkfbp/flows/export',
  update: 'arkfbp/flows/fetch',
  delete: 'arkfbp/flows/update',
  retrieve: 'arkfbp/flows/fetch'
}

const DIALOG_ACTION_NAME = {
  create: 'create',
  import: 'import',
  update: 'update'
}

const DIALOG_ACTION_FLOW = {
  create: 'arkfbp/flows/update',
  import: 'arkfbp/flows/import',
  update: 'arkfbp/flows/update'
}

// key 主要读取btn按钮的label和style, pageType会影响btn按钮的type的是text或其他
export function generateButton(key: string, pageType?: string, isDialog?: boolean) {
  const btn = {
    label: BUTTON_LABEL[key],
    action: isDialog ? DIALOG_ACTION_NAME[key] : PAGE_ACTION_NAME[key],
    type: (pageType === 'TreePage' && (key === 'update' || key === 'delete')) ? 'text' : BUTTON_TYPE[key],
    disabled: key === 'export' ? true : false,
  }
  return btn
}

export function generateDialogState(path: string, method: string, key: string, showReadOnly?: boolean): DialogState | null {
  const dialogType = DIALOG_TYPE[key]
  if (!dialogType) return null
  const schema = getSchemaByPath(path, method)
  const dialogState: DialogState = {}
  dialogState.title = BUTTON_LABEL[key]
  dialogState.visible = false
  dialogState.data = {}
  const btn = generateButton(key, '', true)
  if (!dialogState.buttons?.length) dialogState.buttons = []
  dialogState.buttons.push(btn)
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
  }
  return dialogState
}

export function addDialogAction(pageState: BasePage, path: string, method: string, key: string, showReadOnly?: boolean) {
  const { state, type } = pageState
  const actionName = DIALOG_ACTION_NAME[key]
  const flowName = DIALOG_ACTION_FLOW[key]
  if (actionName) {
    let request = {}
    if (key === 'import') {
      request['data'] = 'dialogs.import.state.state.file'
    } else {
      const target = `dialogs.${key}.state.state.`
      const isResponse = false
      const action = generateAction(path, method, target, isResponse)
      request = Object.assign(request, action)
      state.actions![actionName] = [
        {
          name: flowName,
          url: path,
          method: method,
          request: request
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


export function addPageAction(pageState: BasePage, path: string, method: string, key: string) {
  const { state } = pageState
  const actionName = PAGE_ACTION_NAME[key]
  const flowName = PAGE_ACTION_FLOW[key]
  if (actionName.includes('open')) {
    let response = {
      [`dialogs.${key}.data`]: '',
    }
    const target = `dialogs.${key}.state.state.` 
    const isResponse = true 
    const action = key === 'create' ? {} : generateAction(path, method, target, isResponse)
    response = Object.assign(response, action)
    state.actions![actionName] = [
      {
        name: 'arkfbp/flows/assign',
        response: {
          [`dialogs.${key}.visible`]: true
        }
      }
    ]
    if (key === 'update') {
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
        name: flowName,
        url: path,
        method: method
      },
    ]
    if (key === 'delete') {
      state.actions![actionName].push('fetch')
    }
  }
}


