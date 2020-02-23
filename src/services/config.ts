import Org from '../models/oneid'
import * as models from '../models/config'
import {delayIt, getUuid, http} from './base'

export interface OrgTypeMetaInfo {
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
}

export interface TypeMetaInfo {
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

  qq_config: {
    app_id: string;
  }

  wechat_config: {
    appid: string;
  }

  work_wechat_config: {
    corp_id: string;
    agent_id: string;
  }

  account_config: {
    support_alipay_qr: boolean;
    support_qq_qr: boolean;
    support_wechat_qr: boolean;
    support_work_wechat_qr: boolean;
    support_ding_qr: boolean;
    support_mobile_register: boolean;
    support_email_register: boolean;
    support_mobile: boolean;
    support_email: boolean;
  }

  minio_config: {
    end_point: string;
    access_key: string;
    secret_key: string;
    secure: boolean;
    location: string;
    bucket: string;
  }
}

export class Config {
  static url({oid = '', detail = false, id = '', action = ''} = {}) {
    let url = '/siteapi/oneid/config'
    if (oid) {
      url = `/siteapi/oneid/org/${oid}/config`
    }
    if (detail) {
      url += `/${id}`
    }
    if (action) {
      url += `/${action}`
    }

    return `${url}/`
  }

  static async retrieve(org?: Org) {
    const data = (await http.get(this.url())).data
    let orgData = {}
    if (org) {
      orgData = (await http.get(this.url({oid: org.oid}))).data
    }
    return models.AllConfig.fromData(data, orgData)
  }

  static async partialUpdate(config: models.AllConfig, org?: Org) {
    let configData = config.toConfigData ? config.toConfigData() : config
    let orgData = config.toOrgData ? config.toOrgData() : config
    configData = (await http.patch(this.url(), configData)).data
    if (org) {
      orgData = (await http.patch(this.url({oid: org.oid}), orgData)).data
    }
    return models.AllConfig.fromData(configData, orgData)
  }

  static async getStorageData() {
    return http.get(this.url({action: 'storage'}))
      .then(x => models.StorageConfig.fromData(x.data))
  }

  static async updateStorage(storage: models.StorageConfig) {
    const data = storage.toData ? storage.toData() : storage
    return http.patch(this.url({action: 'storage'}), data)
      .then(x => models.StorageConfig.fromData(x.data))
  }

  static async retrieveMetaPermList(org?: Org) {
    let url = '/siteapi/oneid/meta/perm/'
    if (org) {
      url = `/siteapi/oneid/org/${org.oid}/meta/perm`
    }
    const resp = await http.get(url)
    const results = resp.data.map((i: {uid: string, name: string}) => ({
      id: i.uid,
      name: i.name,
    })) as Array<{id: string, name: string}>
    return {
      results,
    }
  }

  static async retrieveMeta(org?: Org) {
    const data = (await http.get('/siteapi/oneid/meta/')).data
    let orgData = {}
    if (org) {
      orgData = (await http.get(`/siteapi/oneid/org/${org.oid}/meta/`)).data
    }
    return models.AllConfig.fromData(data, orgData)
  }

  static async refreshMeta(org?: Org) {
    window.cachedConfig = await this.retrieveMeta(org)
  }

  static cachedMeta(): models.AllConfig {
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

  static async patchConfig(config: models.FreakConfig|null, editType: string) {
    const url = '/siteapi/oneid/config/'

    const configPart = editType === 'wechatWork' ? 'work_wechat'
      : editType === 'mobile' ? 'sms' : editType

    const configType = `${configPart}_config`
    // tslint:disable-next-line:no-any
    const configData: any= config!.toData()
    const data = {[configType]: configData[configType]}
    return http.patch(url, data).then(x => models.FreakConfig.fromData(x.data))
  }
}

// ********************************************************************************************************
