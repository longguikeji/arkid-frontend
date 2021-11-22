import { getToken } from '@/utils/auth'
import getBaseUrl from '@/utils/get-base-url'
import { ConfigModule } from '@/store/modules/config'
import { TenantModule, ITenant } from '@/store/modules/tenant'
import Message from '@/admin/common/NoticeOrder/message'

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

export function switchTenantBySlug(tenant: ITenant) {
  const beforeSlug = ConfigModule.slug
  const slug = tenant.slug
  if (slug === beforeSlug) {
    Message({
      message: '您所切换租户的短链接与当前租户一致，无需进行切换',
      type: 'info',
      showClose: true
    })
  } else {
    TenantModule.changeCurrentTenant(tenant)
    const path = ConfigModule.desktop.visible ? '/desktop' : '/mine/profile'
    ConfigModule.setSlug(slug)
    const host = ConfigModule.origin
    const newHost = host?.replace(window.location.protocol + '//', window.location.protocol + '//' + slug + '.')
    const url = newHost + path + getBaseUrl() + '?token=' + getToken()
    window.location.replace(url)
  }
}

export function switchTenantByUUID(tenant: ITenant) {
  const currentUUID = TenantModule.currentTenant.uuid
  const uuid = tenant.uuid
  if (currentUUID === uuid) {
    Message({
      message: '您所切换租户与当前租户一致，无需进行切换',
      type: 'info',
      showClose: true
    })
  } else {
    TenantModule.changeCurrentTenant(tenant)
    const path = ConfigModule.desktop.visible ? '/desktop' : '/mine/profile'
    ConfigModule.setSlug()
    const url = ConfigModule.origin + path + getBaseUrl() + `?tenant=${uuid}&token=${getToken()}`
    window.location.replace(url)
  }
}
