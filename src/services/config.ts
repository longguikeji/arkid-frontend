import * as models from '../models/config'
import {delayIt, getUuid, http} from './base'

export interface TypeMetaInfo {
  company_config: {
    name_cn: string;
    fullname_cn: string;
    name_en: string;
    fullname_en: string;
    icon: string;
    color: string;
    address: string;
    domain: string;
    display_name: string;
  }

  sms_config: object

  ding_config: {
    app_key: string;
    app_secret: string;
    app_valid: boolean;
    corp_id: string;
    corp_secret: string;
    corp_valid: boolean;
    qr_app_id: string;
  }

  alipay_config: {
    app_id: string;
  }

  work_wechat_config: {
    corp_id: string;
    agent_id: string;
  }

  account_config: {
    email_register: boolean;
    mobile_register: boolean;
    username_register: boolean;
    email_reset_pwd: boolean;
    mobile_reset_pwd: boolean;
  }
}

export class Config {
  static url({detail = false, id = '', action = ''} = {}) {
    let url = '/siteapi/oneid/config'
    if (detail) {
      url += `/${id}`
    }
    if (action) {
      url += `/${action}`
    }

    return `${url}/`
  }

  static async retrieve() {
    return http.get(this.url())
      .then(x => models.Config.fromData(x.data))
  }

  static async partialUpdate(config: models.Config) {
    const data = config.toData ? config.toData() : config
    return http.patch(this.url(), data)
      .then(x => models.Config.fromData(x.data))
  }

  static async retrieveMetaPermList() {
    const url = '/siteapi/oneid/meta/perm/'
    const resp = await http.get(url)
    const results = resp.data.map((i: {uid: string, name: string}) => ({
      id: i.uid,
      name: i.name,
    })) as Array<{id: string, name: string}>
    return {
      results,
    }
  }

  static async retrieveMeta() {
    const url = '/siteapi/oneid/meta/'
    return http.get(url).then(x => models.Config.fromData(x.data as TypeMetaInfo))
  }

  static async refreshMeta() {
    window.cachedConfig = await this.retrieveMeta()
  }

  static cachedMeta(): models.Config {
    return window.cachedConfig
  }

  static async importDing() {
    const url = '/siteapi/oneid/task/import/ding/'
    return http.get(url).then(x => x.data)
  }

  static async importResult(id: string) {
    const url = `/siteapi/oneid/task/${id}/result/`
    return http.get(url).then(x => x.data)
  }
  static async updateAdmin(username: string, oldMobileSmsToken: string, newMobileSmsToken: string) {
    const url = this.url({action: 'admin'})
    const data = {
      old_admin_sms_token: oldMobileSmsToken,
      new_admin_sms_token: newMobileSmsToken,
      username,
    }
    const resp = await http.put(url, data)
    return resp.data
  }
}

// ********************************************************************************************************
//
// FIXME(@zich): 后续有时间将 services 以及 models 中的 Meta 部分与 config 部分剥离开,
//               因为目前已有逻辑比较混乱且牵扯地方较多，不敢动太多，这里命名与写法看起来比较奇怪，
//               且可能与其余逻辑相比有些赘余～
//
// ********************************************************************************************************

// tslint:disable-next-line:max-classes-per-file
export class FreakConfig {
  static url({detail = false, id = '', action = ''} = {}) {
    let url = '/siteapi/oneid/config'
    if (detail) {
      url += `/${id}`
    }
    if (action) {
      url += `/${action}`
    }
    return `${url}/`
  }

  static async get() {
    return http.get(this.url()).then(x => models.FreakConfig.fromData(x.data))
  }

  static async patchEmail(config: models.FreakConfig|null) {
    const url = '/siteapi/oneid/config/'
    const data = {email_config: config!.toData().email_config}
    return http.patch(url, data).then(x => models.FreakConfig.fromData(x.data))
  }
  static async patchMobile(config: models.FreakConfig|null) {
    const url = '/siteapi/oneid/config/'
    const data = {sms_config: config!.toData().sms_config}
    return http.patch(url, data).then(x => models.FreakConfig.fromData(x.data))
  }
  static async patchAccount(config: models.FreakConfig|null) {
    const url = '/siteapi/oneid/config/'
    const data = {account_config: config!.toData().account_config}
    return http.patch(url, data).then(x => models.FreakConfig.fromData(x.data))
  }
  static async patchDing(config: models.FreakConfig|null) {
    const url = '/siteapi/oneid/config/'
    const data = {ding_config: config!.toData().ding_config}
    return http.patch(url, data).then(x => models.FreakConfig.fromData(x.data))
  }
  static async patchAlipay(config: models.FreakConfig|null) {
    const url = '/siteapi/oneid/config/'
    const data = {alipay_config: config!.toData().alipay_config}
    return http.patch(url, data).then(x => models.FreakConfig.fromData(x.data))
  }
  static async patchWechatWork(config: models.FreakConfig|null) {
    const url = '/siteapi/oneid/config/'
    const data = {work_wechat_config: config!.toData().work_wechat_config}
    return http.patch(url, data).then(x => models.FreakConfig.fromData(x.data))
  }
}

// ********************************************************************************************************
