import { GlobalValueModule } from '@/store/modules/global-value'
import { getToken } from '@/utils/auth'
import getBaseUrl from '@/utils/get-base-url'

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