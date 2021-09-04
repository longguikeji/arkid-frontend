import { getToken } from '@/utils/auth'
import getBaseUrl from '@/utils/get-base-url'
import { ConfigModule } from '@/store/modules/config'

export function getUrlParamByName(name: string) {
  const urlParams = window.location.search.substring(1).split('&')
  for (let i = 0; i < urlParams.length; i++) {
    const thisParams = urlParams[i].split('=')
    if (thisParams[0] === name) return thisParams[1]
  }
  return undefined
}

export function getSlug(): string {
  let slug: string = ''
  const origin = ConfigModule.origin
  const { protocol, host } = window.location
  if (origin && protocol) {
    const arkidHost = origin.replace(`${protocol}//`, '')
    slug = host.replace(arkidHost, '')
    const len = slug.length
    if (len > 0) {
      slug = slug.substring(0, len - 1)
    }
  }
  return slug
}

export function addSlugToUrl(com: any, slug: string = '') {
  const beforeSlug = ConfigModule.slug
  if (slug === beforeSlug) {
    com.$message({
      message: !slug ? '短连接不存在' : '当前短连接标识与切换短连接标识相同',
      type: 'info',
      showClose: true
    })
  } else {
    ConfigModule.setSlug(slug)
    const host = ConfigModule.origin
    const newHost = host?.replace(window.location.protocol + '//', window.location.protocol + '//' + slug + '.')
    const url = newHost + '/' + getBaseUrl() + '?token=' + getToken()
    window.location.replace(url)
  }
}

export function switchTenant(slug: string = '', tenant?: string) {
  const origin = ConfigModule.origin
  if (origin === '') return
  let href = origin + '/' + getBaseUrl() + '?token=' + getToken()
  if (slug === '') {
    href = href + '&tenant=' + tenant
  } else {
    ConfigModule.setSlug(slug)
    const protocol = window.location.protocol
    href = href.replace(`${protocol}//`, `${protocol}://${slug}.`)
  }
  window.location.replace(href)
}
