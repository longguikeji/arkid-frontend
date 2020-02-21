import {TypeMetaInfo, OrgTypeMetaInfo} from '../services/config'
// tslint:disable: max-classes-per-file

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

  static fromData(data: FreakCompanyInterface | null) {
    const obj = new this()
    if (data) {
      obj.address = data.address
      obj.domain = data.domain
      obj.fullNameCn = data.fullname_cn
      obj.fullNameEn = data.fullname_en
      obj.icon = data.icon
      obj.color = data.color || ''
      obj.nameCn = data.name_cn
      obj.nameEn = data.name_en
    }
    return obj
  }
  nameCn = ''
  fullNameCn = ''
  nameEn = ''
  fullNameEn = ''
  icon = ''
  address = ''
  domain = ''
  color = ''

  toData() {
    return {
      address: this.address,
      domain: this.domain,
      fullname_cn: this.fullNameCn,
      fullname_en: this.fullNameEn,
      icon: this.icon,
      name_cn: this.nameCn,
      name_en: this.nameEn,
      // color: this.color,
    }
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

  static fromData(data: FreakDingInterface | null) {
    const obj = new this()
    if (data) {
      obj.appKey = data.app_key
      obj.appSecret = data.app_secret
      obj.appValid = data.app_valid
      obj.corpId = data.corp_id
      obj.corpSecret = data.corp_secret
      obj.corpValid = data.corp_valid
      obj.qrAppId = data.qr_app_id
      obj.qrAppSecret = data.qr_app_secret
      obj.qrAppValid = data.qr_app_valid
    }
    return obj
  }
  appKey = ''
  appSecret = ''
  appValid = false
  corpId = ''
  corpSecret = ''
  corpValid = false
  qrAppId = ''
  qrAppSecret = ''
  qrAppValid = false

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
    }
  }
}

export interface FreakAlipayInterface {
  app_id: string,
  app_private_key: string,
  alipay_public_key: string,
  qr_app_valid: boolean,
}

export class FreakAlipay {
  static fromData(data: FreakAlipayInterface | null) {
    const obj = new this()
    if (data) {
      obj.appId = data.app_id
      obj.appPrivateKey = data.app_private_key
      obj.alipayPublicKey = data.alipay_public_key
      obj.qrAppValid = data.qr_app_valid
    }
    return obj
  }

  appId = ''
  appPrivateKey = ''
  alipayPublicKey = ''
  qrAppValid = false

  toData() {
    return {
      app_id: this.appId,
      app_private_key: this.appPrivateKey,
      alipay_public_key: this.alipayPublicKey,
      qr_app_valid: this.qrAppValid,
    }
  }
}

export interface FreakQQInterface {
  app_id: string,
  redirect_uri: string,
  app_key: string,
  qr_app_valid: boolean,
}

export class FreakQQ {
  static fromData(data: FreakQQInterface | null) {
    const obj = new this()
    if (data) {
      obj.appId = data.app_id
      obj.appKey = data.app_key
      obj.qrAppValid = data.qr_app_valid
    }
    return obj
  }

  appId = ''
  appKey = ''
  qrAppValid = false

  toData() {
    return {
      app_id: this.appId,
      app_key: this.appKey,
      qr_app_valid: this.qrAppValid,
    }
  }
}

export interface FreakWechatInterface {
  appid: string,
  secret: string,
  qr_app_valid: boolean,
}

export class FreakWechat {
  static fromData(data: FreakWechatInterface | null) {
    const obj = new this()
    if (data) {
      obj.appId = data.appid
      obj.secret = data.secret
      obj.qrAppValid = data.qr_app_valid
    }
    return obj
  }

  appId = ''
  secret = ''
  qrAppValid = false

  toData() {
    return {
      appid: this.appId,
      secret: this.secret,
      qr_app_valid: this.qrAppValid,
    }
  }
}

export interface FreakWechatWorkInterface {
  corp_id: string,
  agent_id: string,
  secret: string,
  qr_app_valid: boolean,
}

export class FreakWechatWork {
  static fromData(data: FreakWechatWorkInterface | null) {
    const obj = new this()
    if (data) {
      obj.corpId = data.corp_id
      obj.agentId = data.agent_id
      obj.secret = data.secret
      obj.qrAppValid = data.qr_app_valid
    }
    return obj
  }

  corpId = ''
  agentId = ''
  secret = ''
  qrAppValid = false

  toData() {
    return {
      corp_id: this.corpId,
      agent_id: this.agentId,
      secret: this.secret,
      qr_app_valid: this.qrAppValid,
    }
  }
}

export interface FreakAccountInterface {
  allow_register: boolean,
  allow_mobile: boolean,
  allow_email: boolean,
  allow_ding_qr: boolean,
  allow_alipay_qr: boolean,
  allow_work_wechat_qr: boolean,
  allow_wechat_qr: boolean,
  allow_qq_qr: boolean,
}

export class FreakAccount {

  static fromData(data: FreakAccountInterface | null) {
    const obj = new this()
    if (data) {
      obj.allowRegister = data.allow_register
      obj.allowMobile = data.allow_mobile
      obj.allowEmail = data.allow_email
      obj.allowDingQr = data.allow_ding_qr
      obj.allowAlipayQr = data.allow_alipay_qr
      obj.allowWechatWorkQr = data.allow_work_wechat_qr
      obj.allowWechatQr = data.allow_wechat_qr
      obj.allowQqQr = data.allow_qq_qr
    }
    return obj
  }
  allowRegister = false
  allowMobile = false
  allowEmail = false
  allowDingQr = false
  allowAlipayQr = false
  allowWechatWorkQr = false
  allowWechatQr = false
  allowQqQr = false

  toData() {
    return {
      allow_register: this.allowRegister,
      allow_mobile: this.allowMobile,
      allow_email: this.allowEmail,
      allow_ding_qr: this.allowDingQr,
      allow_alipay_qr: this.allowAlipayQr,
      allow_work_wechat_qr: this.allowWechatWorkQr,
      allow_wechat_qr: this.allowWechatQr,
      allow_qq_qr: this.allowQqQr,
    }
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

  static fromData(data: FreakSMSInterface | null) {
    const obj = new this()
    if (data) {
      obj.vendor = data.vendor
      obj.accessKey = data.access_key
      obj.accessSecret = data.access_secret
      obj.template = data.template_code
      obj.badging = data.signature
      obj.isValid = data.is_valid
    }
    return obj
  }
  vendor = ''
  accessKey = ''
  accessSecret = ''
  template = ''
  badging = ''
  isValid = false

  toData() {
    return {
      vendor: this.vendor,
      access_key: this.accessKey,
      access_secret: this.accessSecret,
      template_code: this.template,
      signature: this.badging,
      // is_valid: this.isValid,
    }
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

  static fromData(data: FreakEmailInterface | null) {
    const obj = new this()
    if (data) {
      obj.host = data.host
      obj.port = data.port.toString()
      obj.account = data.access_key
      obj.password = data.access_secret
      obj.isValid = data.is_valid
    }
    return obj
  }
  host = ''
  port = ''
  account = ''
  password = ''
  isValid = false

  toData() {
    return {
      host: this.host,
      port: Number(this.port),
      access_key: this.account,
      access_secret: this.password,
      // is_valid: this.isValid,
    }
  }
}

export interface FreakConfigInterface {
  company_config: FreakCompanyInterface | null,
  ding_config: FreakDingInterface | null,
  account_config: FreakAccountInterface | null,
  sms_config: FreakSMSInterface | null,
  email_config: FreakEmailInterface | null,
  alipay_config: FreakAlipayInterface | null,
  work_wechat_config: FreakWechatWorkInterface | null,
  wechat_config: FreakWechatInterface | null,
  qq_config: FreakQQInterface | null,
}

export class FreakConfig {

  static fromData(data: FreakConfigInterface | null) {
    const obj = new this()
    if (data) {
      obj.company = FreakCompany.fromData(data.company_config)
      obj.ding = FreakDing.fromData(data.ding_config)
      obj.account = FreakAccount.fromData(data.account_config)
      obj.mobile = FreakSMS.fromData(data.sms_config)
      obj.email = FreakEmail.fromData(data.email_config)
      obj.alipay = FreakAlipay.fromData(data.alipay_config)
      obj.wechatWork = FreakWechatWork.fromData(data.work_wechat_config)
      obj.wechat = FreakWechat.fromData(data.wechat_config)
      obj.qq = FreakQQ.fromData(data.qq_config)
    }
    return obj
  }
  company!: FreakCompany
  ding!: FreakDing
  account!: FreakAccount
  mobile!: FreakSMS
  email!: FreakEmail
  alipay!: FreakAlipay
  wechatWork!: FreakWechatWork
  wechat!: FreakWechat
  qq!: FreakQQ

  toData() {
    return {
      company_config: this.company ? this.company.toData() : null,
      ding_config: this.ding ? this.ding.toData() : null,
      account_config: this.account ? this.account.toData() : null,
      sms_config: this.mobile ? this.mobile.toData() : null,
      email_config: this.email ? this.email.toData() : null,
      alipay_config: this.alipay ? this.alipay.toData() : null,
      work_wechat_config: this.wechatWork ? this.wechatWork.toData() : null,
      wechat_config: this.wechat ? this.wechat.toData() : null,
      qq_config: this.qq ? this.qq.toData() : null,
    }
  }
}

// ********************************************************************************************************

export class Org {
  static fromData(data: OrgTypeMetaInfo['company_config']) {
    const obj = new this()

    if (data) {
      obj.address = data.address
      obj.domain = data.domain
      obj.fullNameCn = data.fullname_cn
      obj.fullNameEn = data.fullname_en
      obj.icon = data.icon
      obj.color = data.color || ''
      obj.nameCn = data.name_cn
      obj.nameEn = data.name_en
    }
    return obj
  }

  address = ''
  domain = ''
  fullNameCn = ''
  fullNameEn = ''
  icon = ''
  color = ''
  nameCn = ''
  nameEn = ''

  toData() {
    return {
      address: this.address,
      domain: this.domain,
      fullname_cn: this.fullNameCn,
      fullname_en: this.fullNameEn,
      icon: this.icon,
      name_cn: this.nameCn,
      name_en: this.nameEn,
    }
  }
}

export class Ding {
  static fromData(data: TypeMetaInfo['ding_config']) {
    const obj = new this()

    if (data) {
      obj.appKey = data.app_key
      obj.appSecret = data.app_secret
      obj.appValid = data.app_valid
      obj.corpId = data.corp_id
      obj.corpSecret = data.corp_secret
      obj.corpValid = data.corp_valid
      obj.qrAppId = data.qr_app_id
    }
    return obj
  }

  appKey = ''
  appSecret = ''
  appValid = false
  corpId = ''
  corpSecret = ''
  corpValid = false
  qrAppId = ''

  toData() {
    return {
      app_key: this.appKey,
      app_secret: this.appSecret,
      corp_id: this.corpId,
      corp_secret: this.corpSecret,
      qr_app_id: this.qrAppId,
    }
  }
}

export class Alipay {
  static fromData(data: TypeMetaInfo['alipay_config']) {
    const obj = new this()
    if (data) {
      obj.appId = data.app_id
    }
    return obj
  }
  appId = ''
  toData() {
    return {
      app_id: this.appId,
    }
  }
}

export class QQ {
  static fromData(data: TypeMetaInfo['qq_config']) {
    const obj = new this()
    if (data) {
      obj.appId = data.app_id
    }
    return obj
  }
  appId = ''
  toData() {
    return {
      app_id: this.appId,
    }
  }
}

export class Wechat {
  static fromData(data: TypeMetaInfo['wechat_config']) {
    const obj = new this()
    if (data) {
      obj.appId = data.appid
    }
    return obj
  }
  appId = ''
  toData() {
    return {
      appid: this.appId,
    }
  }
}

export class WechatWork {
  static fromData(data: TypeMetaInfo['work_wechat_config']) {
    const obj = new this()
    if (data) {
      obj.corpId = data.corp_id
      obj.agentId = data.agent_id
    }
    return obj
  }
  corpId = ''
  agentId = ''
  toData() {
    return {
      corp_id: this.corpId,
      agent_id: this.agentId,
    }
  }
}

export class Account {
  static fromData(data: TypeMetaInfo['account_config']) {
    const obj = new this()
    Object.assign(obj, data)
    return obj
  }

  get isRegisterEnabled(): boolean {
    return this.support_email_register || this.support_mobile_register
  }

  get isResetPasswordEnabled(): boolean {
    return this.support_email || this.support_mobile
  }
}

export class Minio {
  static fromData(data: TypeMetaInfo['minio_config']) {
    const obj = new this()
    if (data) {
      obj.endPoint = data.end_point
      obj.accessKey = data.access_key
      obj.secretKey = data.secret_key
      obj.secure = data.secure
      obj.location = data.location
      obj.bucket = data.bucket
    }
    return obj
  }
  endPoint = ''
  accessKey = ''
  secretKey = ''
  secure = false
  location = ''
  bucket = ''
  toData() {
    return {
      end_point: this.endPoint,
      access_key: this.accessKey,
      secret_key: this.secretKey,
      secure: this.secure,
      location: this.location,
      bucket: this.bucket,
    }
  }
}

export class StorageConfig {
  static fromData(data) {
    const obj = new this()
    obj.method = data.method
    obj.minio = Minio.fromData(data.minio_config)
    return obj
  }
  method = ''
  minio!: Minio|null

  toData() {
    return {
      method: this.method,
      minio_config: this.minio ? this.minio.toData() : null,
    }
  }
}

export class Config {

  static fromData(data: TypeMetaInfo) {
    const obj = new this()

    obj.ding = Ding.fromData(data.ding_config)
    obj.alipay = Alipay.fromData(data.alipay_config)
    obj.wechatWork = WechatWork.fromData(data.work_wechat_config)
    obj.wechat = Wechat.fromData(data.wechat_config)
    obj.qq = QQ.fromData(data.qq_config)
    obj.account = Account.fromData(data.account_config)
    obj.sms = data.sms_config

    return obj
  }
  ding!: Ding
  account!: Account
  sms!: object
  alipay!: Alipay
  wechatWork!: WechatWork
  wechat!: Wechat
  qq!: QQ

  toData() {
    return {
      alipay_config: this.alipay ? this.alipay.toData() : null,
      work_wechat_config: this.wechatWork ? this.wechatWork.toData() : null,
      wechat_config: this.wechat ? this.wechat.toData() : null,
      qq_config: this.qq ? this.qq.toData() : null,
      ding_config: this.ding ? this.ding.toData() : null,
    }
  }
}

export class OrgConfig {
  static fromData(data: OrgTypeMetaInfo) {
    const obj = new this()
    obj.org = Org.fromData(data.company_config)
    return obj
  }

  org!: Org

  toData() {
    return {
      company_config: this.org ? this.org.toData() : null,
    }
  }
}

// TODO@saas: refactor this
export class AllConfig {

  static fromData(data: TypeMetaInfo, org: OrgTypeMetaInfo) {
    const obj = new this()

    obj.ding = Ding.fromData(data.ding_config)
    obj.alipay = Alipay.fromData(data.alipay_config)
    obj.wechatWork = WechatWork.fromData(data.work_wechat_config)
    obj.wechat = Wechat.fromData(data.wechat_config)
    obj.qq = QQ.fromData(data.qq_config)
    obj.account = Account.fromData(data.account_config)
    obj.sms = data.sms_config
    obj.org = Org.fromData(org.company_config)

    return obj
  }
  ding!: Ding
  account!: Account
  sms!: object
  alipay!: Alipay
  wechatWork!: WechatWork
  wechat!: Wechat
  qq!: QQ
  org!: Org

  toData() {
    return {
      alipay_config: this.alipay ? this.alipay.toData() : null,
      work_wechat_config: this.wechatWork ? this.wechatWork.toData() : null,
      wechat_config: this.wechat ? this.wechat.toData() : null,
      qq_config: this.qq ? this.qq.toData() : null,
      ding_config: this.ding ? this.ding.toData() : null,
      company_config: this.org ? this.org.toData() : null,
    }
  }
}
