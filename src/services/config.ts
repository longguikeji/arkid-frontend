import {delayIt, http, getUuid} from './base';
import * as models from '../models/config';


export type TypeMetaInfo = {
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
  };

  sms_config: any;

  ding_config: {
    app_key: string;
    corp_id: string;
  };

  account_config: {
    email_register: boolean;
    mobile_register: boolean;
    username_register: boolean;
    email_reset_pwd: boolean;
    mobile_reset_pwd: boolean;
  };
};


export class Config {
  static url({detail = false, id, action} = {}) {
    let url = '/siteapi/oneid/config';
    if (detail) {
      url += `/${id}`;
    }
    if (action) {
      url += `/${action}`;
    }

    return `${url}/`;
  }

  static retrieve() {
    return http.get(this.url())
      .then(x => models.Config.fromData(x.data));
  }

  static partialUpdate(config: any) {
    const data = config.toData ? config.toData() : config;
    return http.patch(this.url(), data)
      .then(x => models.Config.fromData(x.data));
  }

  static async retrieveMetaPermList() {
    const url = '/siteapi/oneid/meta/perm/';
    const resp = await http.get(url);
    const results = resp.data.map(i => ({
      id: i.uid,
      name: i.name,
    })) as {id: string, name: string}[];
    return {
      results,
    };
  }

  static retrieveMeta() {
    const url = '/siteapi/oneid/meta/';
    return http.get(url).then(x => models.Config.fromData(x.data as TypeMetaInfo));
  }

  static async refreshMeta() {
    window.cachedConfig = await this.retrieveMeta();
  }

  static cachedMeta(): models.Config {
    return window.cachedConfig;
  }

  static importDing() {
    const url = '/siteapi/oneid/task/import/ding/';
    return http.get(url).then(x => x.data);
  }

  static importResult(id) {
    const url = `/siteapi/oneid/task/${id}/result/`;
    return http.get(url).then(x => x.data);
  }
  static async updateAdmin(username: string, oldMobileSmsToken: string, newMobileSmsToken: string) {
    const url = this.url({action: 'admin'});
    const data = {
      old_admin_sms_token: oldMobileSmsToken,
      new_admin_sms_token: newMobileSmsToken,
      username,
    };
    const resp = await http.put(url, data);
    return resp.data;
  }
}


// ********************************************************************************************************
//
// FIXME(@zich): 后续有时间将 services 以及 models 中的 Meta 部分与 config 部分剥离开,
//               因为目前已有逻辑比较混乱且牵扯地方较多，不敢动太多，这里命名与写法看起来比较奇怪，
//               且可能与其余逻辑相比有些赘余～
//
// ********************************************************************************************************

export class FreakConfig {
  static url({detail = false, id, action} = {}) {
    let url = '/siteapi/oneid/config';
    if (detail) {
      url += `/${id}`;
    }
    if (action) {
      url += `/${action}`;
    }
    return `${url}/`;
  }

  static get() {
    return http.get(this.url()).then(x => models.FreakConfig.fromData(x.data));
  }

  static patchEmail(config: any) {
    const url = '/siteapi/oneid/config/';
    const data = {email_config: config.toData().email_config};
    return http.patch(url, data).then(x => models.FreakConfig.fromData(x.data));
  }
  static patchMobile(config: any) {
    const url = '/siteapi/oneid/config/';
    const data = {sms_config: config.toData().sms_config};
    return http.patch(url, data).then(x => models.FreakConfig.fromData(x.data));
  }
  static patchAccount(config: any) {
    const url = '/siteapi/oneid/config/';
    const data = {account_config: config.toData().account_config};
    return http.patch(url, data).then(x => models.FreakConfig.fromData(x.data));
  }
  static patchDing(config: any) {
    const url = '/siteapi/oneid/config/';
    const data = {ding_config: config.toData().ding_config};
    return http.patch(url, data).then(x => models.FreakConfig.fromData(x.data));
  }
}

// ********************************************************************************************************
