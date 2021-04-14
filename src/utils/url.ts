// 此方法为全局中所有流内容公用的解析请求url地址的方法
// 当前所有请求url的地址栏参数有 {id}  {parent_lookup_tenant}  {parent_lookup_webhook}  {tenant_id} 等几种类型和内容
// 除id参数之外，其余内容，当使用到的时候进行引入 store 中的相关存储值进行读取
// id参数则需要在调用该函数时传入data，通过data.id或data.uuid的方式进行读取
import { TenantModule } from '@/store/modules/tenant'

export default function getUrl(currentUrl: string, data: any = {}) {
  let url = currentUrl
  if (url.indexOf('{') !== -1) {
    const property = url.slice(url.indexOf('{') + 1, url.indexOf('}'))
    // 之后如果某个url中有其他的参数需要，可以继续在这里进行添加
    if (property === 'parent_lookup_tenant') {
      url = url.slice(0, url.indexOf('{')) + TenantModule.currentTenant.uuid + url.slice(url.indexOf('}') + 1)
    }
    // 后端路径中的id统一修改成uuid之后，这里可以将property==='id'的判断去掉
    if (property === 'id' || property === 'uuid') {
      url = url.slice(0, url.indexOf('{')) + data.uuid + url.slice(url.indexOf('}') + 1)
    }
  }
  if (url.indexOf('{') !== -1) return getUrl(url, data)
  return url
}

export function getBaseUrl() {
  let baseUrl = process.env.VUE_APP_BASE_API || ''
  if (baseUrl.charAt(0) !== '/' && baseUrl.length > 0) baseUrl = '/' + baseUrl
  return baseUrl
}

export function getUrlParamByName(name: string) {
  const urlParams = window.location.search.substring(1).split('&')
  for (let i = 0; i < urlParams.length; i++) {
    const thisParams = urlParams[i].split('=')
    if (thisParams[0] === name) return thisParams[1]
  }
  return false
}

export function getSlugByUrl() {
  return window.location.hostname.split('.')[0]
}
