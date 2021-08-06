import { TenantModule } from '@/store/modules/tenant'
import { UserModule } from '@/store/modules/user'
import { GlobalValueModule } from '@/store/modules/global-value'
import { getToken } from '@/utils/auth'
import getBaseUrl from '@/utils/get-base-url'
import { FlowModule } from '@/store/modules/flow'
import { isEmptyObject } from '@/utils/common'

export default function getUrl(url: string, page?: string): string {
  if (!url.includes('{')) return url
  const data = FlowModule.data
  const pages = page!.split('.')
  const id = url.slice(url.indexOf('{') + 1, url.indexOf('}'))
  let value
  switch (id) {
    case 'parent_lookup_user':
      value = UserModule.uuid
      break
    case 'token':
      value = getToken() || ''
      break
    default:
      value = TenantModule.currentTenant.uuid || id
  }
  if (value !== id) url = url.slice(0, url.indexOf('{')) + value + url.slice(url.indexOf('}') + 1)
  if (page === 'desktop') return getUrl(url, page)
  if (!isEmptyObject(data)) {
    let name = pages[0]
    for (let i = 0, len = pages.length; i < len; i++) {
      if (!url.includes('{')) break
      url = url.slice(0, url.indexOf('{')) + data[name]?.uuid + url.slice(url.indexOf('}') + 1)
      name += `.${pages[i+1]}`
    }
  }
  return url
}

export function getUrlParamByName(name: string) {
  const urlParams = window.location.search.substring(1).split('&')
  for (let i = 0; i < urlParams.length; i++) {
    const thisParams = urlParams[i].split('=')
    if (thisParams[0] === name) return thisParams[1]
  }
  return undefined
}

export function getSlug() {
  const host = GlobalValueModule.originUrl
  const hostname = host?.replace(window.location.protocol + '//', '') || ''
  let slug = window.location.host.replace(hostname, '')
  if (slug.length > 0) {
    slug = slug.substring(0, slug.length - 1)
  }
  return slug
}

export function addSlugToUrl(com: any, slug: string) {
  const beforeSlug = GlobalValueModule.slug
  if (slug === beforeSlug) {
    com.$message({
      message: !slug ? '短连接不存在' : '当前短连接标识与切换短连接标识相同',
      type: 'info',
      showClose: true
    })
  } else {
    GlobalValueModule.setSlug(slug)
    const host = GlobalValueModule.originUrl
    const newHost = host?.replace(window.location.protocol + '//', window.location.protocol + '//' + slug + '.')
    const url = newHost + '/' + getBaseUrl() + '?token=' + getToken()
    window.location.replace(url)
  }
}
