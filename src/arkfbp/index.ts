import { runWorkflowByClass } from 'arkfbp/lib/flow'
import { stateFilter } from '@/utils/flow'
import getUrl from '@/utils/url'
import { FlowModule } from '@/store/modules/flow'
import { isEmptyObject, getOneCharacterIndexsInString } from '@/utils/common'
import getDataByPath from '@/utils/datapath'

export interface IFlow {
  name: string
  url?: string
  method?: string
  request?: any
  response?: any
  target?: string // 配置jump时跳转的目标页面
  path?: string // 用于组件之间的指向
  required?: any // 用于验证
  data?: any
  parent?: string
}

// 根据某个按钮处的 action 配置项（字符串或函数格式--函数格式在BaseVue.ts中直接执行）
// 查找当前 page-state 的 actions 中的以 actionName 为 key 的配置项内容
// 并逐一执行其中的各个流内容
export async function runFlowByActionName(com: any, actionName: string, page?: string, path?: string) {
  const currentPageState = getCurrentPageState(com, page, path) || com.state
  if (!currentPageState) return
  const { name: currentPage, parent, actions } = currentPageState
  if (!actions) return
  const currentFlows: (IFlow | string)[] = actions[actionName]
  if (currentFlows?.length) {
    FlowModule.startRunFlow()
    for (let i = 0, l = currentFlows.length; i < l; i++) {
      if (!FlowModule.run) break
      const flow = currentFlows[i]
      if (typeof flow === 'string') {
        if (flow.includes('.')) {
          const fs = flow.split('.')
          if (fs.length === 2) {
            const appointedPage = fs[0]
            const appointedPageActionName = fs[1]
            await runFlowByActionName(com, appointedPageActionName, appointedPage)
          } else {
            const appointedActionName = fs[fs.length - 1]
            await runFlowByActionName(com, appointedActionName, undefined, flow)
          }
        } else {
          await runFlowByActionName(com, flow)
        }
      } else {
        await runFlow(com, currentPageState, flow as IFlow, currentPage, parent)
      }
    }
  }
}

// 通过该函数去调用 runFlowByFile -- 解析 request 的参数信息
async function runFlow (com: any, state: any, flow: IFlow, currentPage: string, parent?: string) {
  const { name: filePath, ...args } = flow
  const data = com.state?.selectedData || com.state?.data || state?.data
  let url = args.url, method
  if (url) {
    const p = args.parent || parent
    if (url.indexOf('{') !== -1 && p) {
      const urls = FlowModule.urls
      const key = Object.keys(urls[p])[0]
      url = url.replace(key, urls[p][key])
    }
    url = getUrl(url, data, currentPage)
    FlowModule.addUrl({ page: currentPage, url: args.url, value: url })
    method = args.method?.toUpperCase()
  }
  const inputs = {
    url,
    method,
    params: {},
    client: state,
    clientServer: args.response,
    target: args.target,
    path: args.path,
    com: com,
    required: args.required,
    data: data
  }
  // 对 request 请求参数进行解析处理
  if (args.request && !isEmptyObject(args.request)) {
    const mapping = stateMappingProxy(state, args.request)
    inputs.params = parseStateMapping(state, mapping)
  }
  await runFlowByFile(filePath, inputs)
}

// 使用 arkfbp-javascript 执行配置中的流内容 
// arkfbp-javascript: https://github.com/longguikeji/arkfbp-javascript
export async function runFlowByFile(flowPath: string, inputs: any) {
  if (!flowPath) {
    return
  }
  if (/^(@\/)/.test(flowPath)) {
    flowPath = flowPath.slice(2)
  }
  const flow = await import(`@/${flowPath}`)
  const outputs = await runWorkflowByClass(flow.Main, inputs)
  return outputs
}

// 对Mapping进行一次二次处理
function stateMappingProxy(state: any, mappings: any) {
  let newMapping = {}
  const keys = Object.keys(mappings)
  for (const key of keys) {
    const mapping = mappings[key]
    const mappingType = typeof mapping
    if (mappingType === 'object' && mapping.value) {
      const valueMapping = mapping.value
      const selectValue = getStateByStringConfig(state, valueMapping)
      newMapping = Object.assign(newMapping, { [key]: valueMapping }, { ...mapping[selectValue] })
    } else {
      newMapping[key] = mapping
    }
  }
  return newMapping
}

// 对配置项中的 request 或者 response 进行配置解析
// 参数说明
// state: current page state
// mapping: request or response config
function parseStateMapping(state: any, mapping: any) {
  let params = {}
  Object.keys(mapping).forEach(key => {
    let tempState
    const item = mapping[key]
    if (typeof item === 'string') {
      tempState = getStateByStringConfig(state, item)
      if (tempState !== undefined && tempState !== null && tempState !== '') {
        params[key] = tempState
      }
    } else {
      params[key] = item
    }
  })
  return params
}

function getStateByStringConfig(state: any, str: string) {
  let tempState = state
  const strMapping = str.split('.')
  if (strMapping.length) {
    strMapping.forEach(sm => {
      if (sm.includes('[')) {
        const idx = sm.indexOf('[')
        const firstKey = sm.substring(0, idx)
        const secondKey = stateFilter(sm, tempState)
        tempState = tempState[firstKey][secondKey]
      } else {
        const value = tempState[sm]
        if (value || (!value && sm === 'value')) {
          tempState = value
        } else {
          tempState = str
        }
      }
    })
  }
  return tempState
}

function getCurrentPageState(com: any, page?: string, p?: string) {
  let path = p || com.path
  let pageState
  const ps = path.split('.')
  if (ps.length === 3) ps.pop()
  path = ps.join('.')
  if (!path) return
  const indexs = getOneCharacterIndexsInString(path, '.')
  const pathMappings: string[] = []
  for (let i = indexs.length - 1; i >= 1; i--) {
    const pathMapping = path.substring(0, indexs[i])
    pathMappings.push(pathMapping)
  }
  for (let i = 0, l = pathMappings.length; i < l; i++) {
    const state = getDataByPath(com.$store.state, pathMappings[i])
    if (!page) {
      const isBasePage = state?.type && ( state.type === 'TablePage' || state.type === 'FormPage' || state.type === 'TreePage' || state.type === 'DashboardPage')
      if (isBasePage) {
        pageState = state.state
        break
      }
    } else {
      if (state.name === page) {
        pageState = state
        break
      }
    }
  }
  return pageState
}