import { ConfigModule } from '@/store/modules/config'
import isIp from 'is-ip'

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

export function isIPAddress() {
  let { host, port } = window.location
  if (port !== '') {
    host = host.substring(0, host.lastIndexOf(':'))
  }
  return isIp(host)
}