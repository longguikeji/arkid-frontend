import DialogState from '@/admin/common/Others/Dialog/DialogState'
import { getSchemaByPath, getApiRoles, getContent } from '@/utils/schema'
import generateForm from '@/utils/form'
import { IPage} from '@/flows/basePage/nodes/pageNode'
import { getActionMapping } from '@/utils/generate-action'
import ButtonState from '@/admin/common/Button/ButtonState'
import OpenAPI, { ITagPageAction, ITagUpdateAction, ISchema } from '@/config/openapi'
import { UserModule, UserRole } from '@/store/modules/user'

const BUTTON_LABEL = {
  create: '创建',
  import: '导入',
  export: '导出',
  update: '编辑',
  delete: '删除',
  retrieve: '查看',
  password: '修改密码',
  history: '历史记录',
  provisioning: '同步配置',
  mapping: '配置映射',
  profile: '配置文件',
  retry: '重发'
}

const BUTTON_TYPE = {
  node: 'text', // tree node slot button
  delete: 'danger',
  default: 'primary'
}

const DIALOG_TYPE = {
  create: 'FormPage',
  import: 'Upload',
  update: 'FormPage',
  retrieve: 'FormPage',
  password: 'Password',
  history: 'TablePage',
  provisioning: 'TablePage',
  mapping: 'TablePage',
  profile: 'TablePage'
}

const PAGE_READONLY_TRUE = ['app_list', 'external_idp']

const BUTTON_ACTION_NAME = {
  create: 'openCreateDialog',
  import: 'openImportDialog',
  export: 'export',
  update: 'openUpdateDialog',
  delete: 'delete',
  retrieve: 'openRetrieveDialog',
  password: 'openPasswordDialog',
  history: 'openHistoryDialog',
  provisioning: 'openProvisioningDialog',
  mapping: 'openMappingDialog',
  profile: 'openProfileDialog',
  retry: 'retry'
}

const BUTTON_ACTION_FLOW = {
  create: 'arkfbp/flows/assign',
  import: 'arkfbp/flows/assign',
  export: 'arkfbp/flows/export',
  delete: 'arkfbp/flows/update',
  password: 'arkfbp/flows/assign',
  update: 'arkfbp/flows/fetch',
  retrieve: 'arkfbp/flows/fetch',
  history: 'arkfbp/flows/assign',
  provisioning: 'arkfbp/flows/assign',
  mapping: 'arkfbp/flows/assign',
  profile: 'arkfbp/flows/assign',
  retry: 'arkfbp/flows/update'
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

const getButtonType = (key: string, pageType: string) => {
  if (pageType === 'TreePage' && (key === 'update' || key === 'delete')) {
    return BUTTON_TYPE.node
  } else if (key === 'delete') {
    return BUTTON_TYPE.delete
  } else {
    return BUTTON_TYPE.default
  }
}

export function generateButton(key: string, path: string, method: string, currentPage: string, pageType: string, isDialog?: boolean): ButtonState | null {
  // const apiRoles = getApiRoles(path, method)
  // const userRole = UserModule.role
  // if (!apiRoles.includes(userRole) && userRole !== UserRole.Platform && currentPage !== 'tenant') return null
  const btn: ButtonState = {
    label: BUTTON_LABEL[key],
    action: isDialog ? DIALOG_ACTION_NAME[key] : BUTTON_ACTION_NAME[key],
    type: getButtonType(key, pageType),
    disabled: key === 'export' ? true : false,
    hint: currentPage === 'tenant_config' ? '删除后将彻底无法恢复' : undefined
  }
  return btn
}

export function generateDialogState(path: string, method: string, key: string, currentPage: string): DialogState | null {
  const dialogType = DIALOG_TYPE[key]
  if (!dialogType) return null
  const showReadOnly = PAGE_READONLY_TRUE[currentPage] || false
  const showWriteOnly = true, disabled = key === 'retrieve' ? true : false
  const schema = getSchemaByPath(path, method)
  const dialogState: DialogState = {}
  dialogState.title = BUTTON_LABEL[key]
  dialogState.visible = false
  dialogState.data = {}
  if (dialogType !== 'Password' && key !== 'retrieve') {
    const btn = generateButton(key, path, method, currentPage, '', true)
    if (!btn) return null
    if (!dialogState.buttons?.length) dialogState.buttons = []
    dialogState.buttons.push(btn)
  } else {
    dialogState.cancelFooter = true
  }
  switch (dialogType) {
    case 'FormPage':
      dialogState.state = {
        type: 'FormPage',
        state: generateForm(schema, showReadOnly, showWriteOnly, disabled)
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
          hasOldPassword: !!schema.properties?.old_password
        }
      }
  }
  return dialogState
}

export function addGlobalExportAction(state: IPage, path: string, method: string, key: string) {
  const actionName = BUTTON_ACTION_NAME[key], flowName = BUTTON_ACTION_FLOW[key]
  state.actions![actionName] = [
    {
      name: flowName,
      url: path,
      method: method
    }
  ]
}

export function addGlobalPasswordAction(state: IPage, key: string) {
  const actionName = BUTTON_ACTION_NAME[key], flowName = BUTTON_ACTION_FLOW[key]
  state.actions![actionName] = [
    {
      name: flowName,
      response: {
        [`dialogs.password.visible`]: true
      }
    }
  ]
}

export function addDeleteAction(state: IPage, path: string, method: string, key: string) {
  const actionName = BUTTON_ACTION_NAME[key], flowName = BUTTON_ACTION_FLOW[key]
  state.actions![actionName] = [
    {
      name: flowName,
      url: path,
      method: method,
    }
  ]
  if (method !== 'get') state.actions![actionName].push('fetch')
}

export function addOtherGlobalAction(state: IPage, path: string, method: string, key: string, pageType: string) {
  const actionName = BUTTON_ACTION_NAME[key], flowName = BUTTON_ACTION_FLOW[key]
  const targetPrefix = `dialogs.${key}.state.state.`,
        isResponse = true,
        blank = pageType === 'FormPage' ? false : true
  const { mapping } = getActionMapping(path, method, targetPrefix, isResponse, blank)
  state.actions![actionName] = [
    {
      name: 'arkfbp/flows/cancelValidate'
    },
    {
      name: flowName,
      url: path,
      method: method,
      response: {
        ...mapping
      }
    },
    {
      name: 'arkfbp/flows/assign',
      response: {
        [`dialogs.${key}.visible`]: true
      }
    }
  ]
}

export function addDialogAction(state: IPage, path: string, method: string, key: string) {
  const actionName = DIALOG_ACTION_NAME[key], flowName = DIALOG_ACTION_FLOW[key]
  if (!actionName || !flowName) return
  switch (key) {
    case 'import':
      addImportDialogAction(state, path, method, actionName, flowName)
      break
    default:
      addOtherDialogAction(state, path, method, actionName, flowName, key)
  }
}

export function addImportDialogAction(state: IPage, path: string, method: string, actionName: string, flowName: string) {
  state.actions![actionName] = [
    {
      name: flowName,
      url: path,
      method: method,
      request: {
        data: 'dialogs.import.state.state.file'
      }
    },
    {
      name: 'arkfbp/flows/assign',
      response: {
        [`dialogs.import.visible`]: false
      }
    },
    'fetch'
  ]
}

export function addOtherDialogAction(state: IPage, path: string, method: string, actionName: string, flowName: string, key: string) {
  const targetPrefix = `dialogs.${key}.state.state.`,
        isResponse = false
  const { mapping, required } = getActionMapping(path, method, targetPrefix, isResponse)
  state.actions![actionName] = [
    {
      name: 'arkfbp/flows/validate'
    },
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
    {
      name: 'arkfbp/flows/cancelValidate'
    },
    'fetch'
  ]
}

export function addLocalSortAction(state: IPage, action: ITagUpdateAction) {
  Object.keys(action).forEach((sortName) => {
    const url = action[sortName].path
    const method = action[sortName].method
    const actionName = 'sortBy' + sortName
    state.actions![actionName] = [
      {
        name: 'arkfbp/flows/sort',
        url: url,
        method: method,
        request: sortName === 'batch' ? {
          idps: {
            key: 'uuid',
            data: 'table.data'
          }
        } : undefined
      },
      'fetch'
    ]
  })
}

export function addLocalChildrenAction(state: IPage, path: string, method: string) {
  state.tree!.action = 'fetchTreeNode'
  state.actions!.fetchTreeNode = [
    {
      name: "arkfbp/flows/fetchTreeNode",
      url: path,
      method: method
    }
  ]
}

export function addOtherLocalAction(state: IPage, path: string, method: string, key: string) {
  const actionName = BUTTON_ACTION_NAME[key]
  const flowName = BUTTON_ACTION_FLOW[key]
  const type = DIALOG_TYPE[key]
  if (flowName) {
    if (type === 'FormPage') {
      const targetPrefix = `dialogs.${key}.state.state.` 
      const isResponse = true
      const { mapping } = getActionMapping(path, method, targetPrefix, isResponse)
      state.actions![actionName] = [
        {
          name: flowName,
          url: path,
          method: method,
          response: {
            ...mapping,
            [`dialogs.${key}.data`]: ''
          }
        },
        {
          name: 'arkfbp/flows/cancelValidate'
        },
        {
          name: 'arkfbp/flows/assign',
          response: {
            [`dialogs.${key}.visible`]: true
          }
        }
      ]
      if (method === 'get') {
        state.actions![actionName].push()
      }
    } else {
      state.actions![actionName] = [
        {
          name: 'arkfbp/flows/assign',
          response: {
            [`dialogs.${key}.visible`]: true,
            [`dialogs.${key}.state.state.data`]: ''
          }
        }
      ]
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