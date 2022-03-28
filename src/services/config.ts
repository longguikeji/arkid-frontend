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

  contacts_config: {
    is_show: boolean;
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

  static async getContactsSwitch() {
    const { data } = await http.get(this.url({ action: 'contacts' }))
    return data.is_show
  }

  static async updateContactsSwitch(show: boolean) {
    http.put(this.url({ action: 'contacts' }), { is_show: show })
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

  static async getInternationalMobile() {
    return http.get(this.url({action: 'i18n_mobile'})).then(x => x.data)
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

export class CustomFieldConfig {

  static async getList(subject:string){
    const url = `/siteapi/oneid/config/custom/field/${subject}/`
    return http.get(url).then(x => x.data)
  }

  static async createField(subject:string,data:object){
    const url = `/siteapi/oneid/config/custom/field/${subject}/`
    return http.post(url,data).then(x => x.data)
  }

  static async deleteField(subject:string,uuid:string){
    const url = `/siteapi/oneid/config/custom/field/${subject}/${uuid}/`
    return http.delete(url).then(x => x.data)
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
