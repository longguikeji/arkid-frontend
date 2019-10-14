import {TypeMetaInfo} from '../services/config';


// ********************************************************************************************************
//
// FIXME(@zich): 后续有时间将 services 以及 models 中的 Meta 部分与 config 部分剥离开,
//               因为目前已有逻辑比较混乱且牵扯地方较多，不敢动太多，这里命名与写法看起来比较奇怪，
//               且可能与其余逻辑相比有些赘余～
//
// ********************************************************************************************************

export interface FreakCompanyInterface {
  address: string,
  domain: string,
  fullname_cn: string,
  fullname_en: string,
  icon: string,
  name_cn: string,
  name_en: string,
  color: string,
}

export class FreakCompany {
  nameCn = '';
  fullNameCn = '';
  nameEn = '';
  fullNameEn = '';
  icon = '';
  address = '';
  domain = '';
  color = '';

  static fromData(data: FreakCompanyInterface | null) {
    const obj = new this();
    if (data) {
      obj.address = data.address;
      obj.domain = data.domain;
      obj.fullNameCn = data.fullname_cn;
      obj.fullNameEn = data.fullname_en;
      obj.icon = data.icon;
      obj.color = data.color || '';
      obj.nameCn = data.name_cn;
      obj.nameEn = data.name_en;
    }
    return obj;
  }

  toData() {
    return {
      address: this.address,
      domain: this.domain,
      fullname_cn: this.fullNameCn,
      fullname_en: this.fullNameEn,
      icon: this.icon,
      name_cn: this.nameCn,
      name_en: this.nameEn,
      //color: this.color,
    };
  }
}

export interface FreakDingInterface {
  app_key: string,
  app_secret: string,
  corp_id: string,
  corp_secret: string,
  app_valid: boolean,
  corp_valid: boolean,
  qr_app_id: string,
  qr_app_secret: string,
  qr_app_valid: boolean,
}

export class FreakDing {
  appKey = '';
  appSecret = '';
  appValid = false;
  corpId = '';
  corpSecret = '';
  corpValid = false;
  qrAppId = '';
  qrAppSecret = '';
  qrAppValid = false;

  static fromData(data: FreakDingInterface | null) {
    const obj = new this();
    if (data) {
      obj.appKey = data.app_key;
      obj.appSecret = data.app_secret;
      obj.appValid = data.app_valid;
      obj.corpId = data.corp_id;
      obj.corpSecret = data.corp_secret;
      obj.corpValid = data.corp_valid;
      obj.qrAppId = data.qr_app_id;
      obj.qrAppSecret = data.qr_app_secret;
      obj.qrAppValid = data.qr_app_valid;
    }
    return obj;
  }

  toData() {
    return {
      app_key: this.appKey,
      app_secret: this.appSecret,
      corp_id: this.corpId,
      corp_secret: this.corpSecret,
      qr_app_id: this.qrAppId,
      qr_app_secret: this.qrAppSecret,
      qr_app_valid: this.qrAppValid,
      // app_valid: this.appValid,
      // corp_valid: this.corpValid,
    };
  }
}

export interface FreakAccountInterface {
  allow_register: boolean,
  allow_mobile: boolean,
  allow_email: boolean,
  allow_ding_qr: boolean,
}

export class FreakAccount {
  allowRegister = false;
  allowMobile = false;
  allowEmail = false;
  allowDingQR = false;

  static fromData(data: FreakAccountInterface | null) {
    const obj = new this();
    if (data) {
      obj.allowRegister = data.allow_register;
      obj.allowMobile = data.allow_mobile;
      obj.allowEmail = data.allow_email;
      obj.allowDingQR = data.allow_ding_qr;
    }
    return obj;
  }

  toData() {
    return {
      allow_register: this.allowRegister,
      allow_mobile: this.allowMobile,
      allow_email: this.allowEmail,
      allow_ding_qr: this.allowDingQR,
    };
  }
}

export interface FreakSMSInterface {
  vendor: string,
  access_key: string,
  access_secret: string,
  template_code: string,
  signature: string,
  is_valid: boolean,
}

export class FreakSMS {
  vendor = '';
  accessKey = '';
  accessSecret = '';
  template = '';
  badging = '';
  isValid = false;

  static fromData(data: FreakSMSInterface | null) {
    const obj = new this();
    if (data) {
      obj.vendor = data.vendor;
      obj.accessKey = data.access_key;
      obj.accessSecret = data.access_secret;
      obj.template = data.template_code;
      obj.badging = data.signature;
      obj.isValid = data.is_valid;
    }
    return obj;
  }

  toData() {
    return {
      vendor: this.vendor,
      access_key: this.accessKey,
      access_secret: this.accessSecret,
      template_code: this.template,
      signature: this.badging,
      //is_valid: this.isValid,
    };
  }
}

export interface FreakEmailInterface {
  host: string,
  port: number,
  access_key: string,
  access_secret: string,
  is_valid: boolean,
}

export class FreakEmail {
  host = '';
  port = '';
  account = '';
  password = '';
  isValid = false;

  static fromData(data: FreakEmailInterface | null) {
    const obj = new this();
    if (data) {
      obj.host = data.host;
      obj.port = data.port.toString();
      obj.account = data.access_key;
      obj.password = data.access_secret;
      obj.isValid = data.is_valid;
    }
    return obj;
  }

  toData() {
    return {
      host: this.host,
      port: parseInt(this.port, 10),
      access_key: this.account,
      access_secret: this.password,
      //is_valid: this.isValid,
    };
  }
}

export interface FreakConfigInterface {
  company_config: FreakCompanyInterface | null,
  ding_config: FreakDingInterface | null,
  account_config: FreakAccountInterface | null,
  sms_config: FreakSMSInterface | null,
  email_config: FreakEmailInterface | null,
}

export class FreakConfig {
  company!: FreakCompany;
  ding!: FreakDing;
  account!: FreakAccount;
  mobile!: FreakSMS;
  email!: FreakEmail;

  static fromData(data: FreakConfigInterface | null) {
    const obj = new this();
    if (data) {
      obj.company = FreakCompany.fromData(data.company_config);
      obj.ding = FreakDing.fromData(data.ding_config);
      obj.account = FreakAccount.fromData(data.account_config);
      obj.mobile = FreakSMS.fromData(data.sms_config);
      obj.email = FreakEmail.fromData(data.email_config);
    }
    return obj;
  }

  toData() {
    return {
      company_config: this.company ? this.company.toData() : null,
      ding_config: this.ding ? this.ding.toData() : null,
      account_config: this.account ? this.account.toData() : null,
      sms_config: this.mobile ? this.mobile.toData() : null,
      email_config: this.email ? this.email.toData() : null,
    };
  }
}

// ********************************************************************************************************


export class Org {
  static fromData(data) {
    const obj = new this();

    obj.address = data.address;
    obj.domain = data.domain;
    obj.fullNameCn = data.fullname_cn;
    obj.fullNameEn = data.fullname_en;
    obj.icon = data.icon;
    obj.color = data.color || '';
    obj.nameCn = data.name_cn;
    obj.nameEn = data.name_en;

    return obj;
  }

  address = '';
  domain = '';
  fullNameCn = '';
  fullNameEn = '';
  icon = '';
  color = '';
  nameCn = '';
  nameEn = '';

  toData() {
    return {
      address: this.address,
      domain: this.domain,
      fullname_cn: this.fullNameCn,
      fullname_en: this.fullNameEn,
      icon: this.icon,
      name_cn: this.nameCn,
      name_en: this.nameEn,
    };
  }
}


export class Ding {
  static fromData(data) {
    const obj = new this();

    obj.appKey = data.app_key;
    obj.appSecret = data.app_secret;
    obj.appValid = data.app_valid;
    obj.corpId = data.corp_id;
    obj.corpSecret = data.corp_secret;
    obj.corpValid = data.corp_valid;
    obj.qrAppId = data.qr_app_id;
    obj.qrCallBackUrl = data.qr_callback_url;

    return obj;
  }

  appKey = '';
  appSecret = '';
  appValid = false;
  corpId = '';
  corpSecret = '';
  corpValid = false;
  qrAppId = '';
  qrCallBackUrl = '';

  toData() {
    return {
      app_key: this.appKey,
      app_secret: this.appSecret,
      corp_id: this.corpId,
      corp_secret: this.corpSecret,
      qr_app_id: this.qrAppId,
      qr_callback_url: this.qrCallBackUrl,
    };
  }
}


type AccountInfo = TypeMetaInfo['account_config'];


export class Account {
  static fromData(data: any) {
    const obj = new this();
    Object.assign(obj, data);
    return obj;
  }

  get isRegisterEnabled(): boolean {
    return this.support_email_register || this.support_mobile_register;
  }

  get isResetPasswordEnabled(): boolean {
    return this.support_email || this.support_mobile;
  }
}

export class Config {
  ding!: Ding;
  org!: Org;
  account!: Account;

  static fromData(data: TypeMetaInfo) {
    const obj = new this();

    obj.ding = Ding.fromData(data.ding_config);
    obj.org = Org.fromData(data.company_config);
    obj.account = Account.fromData(data.account_config);
    obj.sms = data.sms_config;

    return obj;
  }

  toData() {
    return {
      ding_config: this.ding ? this.ding.toData() : null,
      company_config: this.org ? this.org.toData() : null,
    };
  }
}
