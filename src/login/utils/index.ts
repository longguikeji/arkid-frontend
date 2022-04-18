import {
  BACKEND_AUTH_API,
  GET_LOGIN_PAGE_API,
  QUERY_KEYS,
  TENANT_KEY,
  THIRD_PARTY_ROUTE,
  ARKID_SAAS_NAME,
} from '../constant'
import http from './http'
import LoginStore from '../store'
import { Route } from 'vue-router'
import { Message } from 'element-ui'
import { LoginPagesConfig, LoginExtendConfig, ButtonConfig } from '../interface'
import getBaseUrl from '../../utils/get-base-url'

type Dictionary<T> = { [key: string]: T }

// backend_auth
export async function backendAuth() {
  const data = await http[BACKEND_AUTH_API.method](BACKEND_AUTH_API.url)
  const token = data?.data?.token
  if (token) {
    LoginStore.token = token
    window.location.reload()
  }
}

// 获取LoginPage
export async function getLoginPage(router: Route) {
  const hasPermission = redirectNextUrl(router)

  let url = GET_LOGIN_PAGE_API.url
  const uuid = LoginStore.TenantUUID
  if (uuid) url = `${url}?${TENANT_KEY}=${uuid}`
  const resp = (await http.get(url)).data
  if (!resp?.data) return {}

  const { tenant, data } = resp
  const config: LoginPagesConfig = {}
  // 对第三方登录进行操作
  Object.keys(data).forEach((key) => {
    const item = data[key]
    if (item?.extend) {
      config[key] = {
        ...item,
        extend: getExtendLogin(item.extend, hasPermission),
      }
    } else {
      config[key] = item
    }
  })
  return { tenant, config }
}

// 第三方登录信息
function getExtendLogin(
  extend: LoginExtendConfig,
  hasPermission: boolean = true,
) {
  // 第三方登录的nextUrl
  let thirdPartyNextUrl = `${window.location.origin}${getBaseUrl()}${THIRD_PARTY_ROUTE}`
  if (LoginStore.NextUrl) {
    thirdPartyNextUrl = `${thirdPartyNextUrl}&${QUERY_KEYS.next}=${LoginStore.NextUrl}`
  }
  if (!LoginStore.ThirdUserID && !LoginStore.BindUrl && extend.buttons) {
    for (let i = 0, length = extend.buttons.length; i < length; i++) {
      const button = extend.buttons[i]
      if (!button.redirect) continue
      button.redirect.params = {
        ...button.redirect.params,
        next: encodeURIComponent(thirdPartyNextUrl),
      }
      if (button.tooltip === ARKID_SAAS_NAME && hasPermission) {
        redirect(button) // 转向到 ArkID_SAAS
      }
    }
  }
  return extend
}

// redirect nextUrl
function redirectNextUrl(router: Route) {
  const query = router.query
  // 是否有权限访问
  let hasPermission = true
  // 没有权限访问时的信息提示
  let info = ''
  // 重定向的url地址
  let nextUrl = getOneQueryParam(QUERY_KEYS.next, query)
  if (!nextUrl) return hasPermission

  // 生成nextUrl
  const keys = Object.keys(query)
  for (const key of keys) {
    if (key === QUERY_KEYS.next) continue
    if (nextUrl.includes(`&${key}=`)) continue
    if (nextUrl.includes(`?${key}=`)) continue
    if (key === QUERY_KEYS.isAlert) {
      LoginStore.token = null
      hasPermission = false
      info = getOneQueryParam(key, query)
    }
    nextUrl += `&${key}=${query[key]}`
  }
  if (nextUrl.indexOf('?') === -1) nextUrl = nextUrl.replace('&', '?')
  nextUrl = window.location.origin + nextUrl

  // 如果当前Token存在, 则重定向到nextUrl
  if (LoginStore.token) {
    const prefix = nextUrl.includes('?') ? '&' : '?'
    window.location.replace(
      nextUrl + `${prefix}${LoginStore.TOKEN}=` + LoginStore.token,
    )
  } else {
    // 临时存储nextUrl
    LoginStore.NextUrl = nextUrl
  }

  // 如果没有权限, 提示用户
  if (!hasPermission) {
    Message({ message: info, showClose: true, type: 'error' })
  }

  return hasPermission
}

// redirect url
export function redirect(btn: ButtonConfig) {
  const { url, params } = btn.redirect!
  if (!url) return
  let redirectParams = ''
  if (params) {
    for (const key in params) {
      redirectParams += `&${key}=${params[key]}`
    }
    redirectParams = redirectParams.substring(1)
  }
  const prefix = url.includes('?') ? '&' : '?'
  window.location.replace(url + prefix + redirectParams)
}

// 获取Query中的某个参数
function getOneQueryParam(
  key: string,
  query: Dictionary<string | (string | null)[]>,
) {
  const val = query[key]
  if (!val) return ''
  if (typeof val === 'string') return val
  return val[0] || ''
}
