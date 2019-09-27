// tslint:disable: max-classes-per-file
import {random, range} from 'lodash';
import {API, delayIt, http, getUuid, ONEID_TOKEN, getAuthorization} from './base';
import * as model from '../models/oneid';
import * as dd from 'dingtalk-jsapi';
import * as configApis from './config';
import {isDingtalk} from '../utils';

export * from './node';
export * from './config';

function exchangeAuthData(rawData){
  return {
    meta: {'count': rawData.count},
    data: rawData.results,
  };
}

export class Dept {
  static url({detail = false, id, action} = {}) {
    let url = '/siteapi/oneid/dept';
    if (detail) {
      url += `/${id}`;
    }
    if (action) {
      url += `/${action}`;
    }

    return `${url}/`;
  }

  static async list(q) {
    const url = this.url();
    const resp = await http.get(url, {params: q});
    return {
      ...resp.data,
      results: resp.data.results.map(dept => model.Dept.fromData(dept)),
    };
  }

  static create(dept) {
    const url = this.url({detail: true, id: dept.parent.id, action: 'dept'});
    const {parent, ...data} = dept.toData();
    return http.post(url, data).then(x => x.data);
  }

  static async partialUpdate(dept) {
    const resp = await http.patch(`/siteapi/oneid/dept/${dept.id}/`, dept.toData());
    if (dept.parent) {
      await this.addChildDept(dept.parent.id, [dept.id]);
    }
    return resp.data;
  }

  static addChildDept(id, childrenIds) {
    const url = this.url({detail: true, id, action: 'dept'});
    const data = {dept_uids: childrenIds, subject: 'add'};
    return http.patch(url, data).then(x => x.data);
  }

  static remove(dept) {
    const url = this.url({detail: true, id: dept.id});
    return http.delete(url).then(x => x.data);
  }

  static tree() {
    const url = this.url({detail: true, id: 'root', action: 'tree'});
    const data = {params: {user_required: true}};
    return http.get(url, data)
      .then(x => model.Dept.fromTreeData(x.data).tree);
  }
  static async hierarchy() {
    const url = this.url({detail: true, id: 'root', action: 'tree'});
    const data = {params: {user_required: true}};
    const resp = await http.get(url, data);
    return model.Dept.fromHierarchyData(resp.data);
  }

  static async user(id: number) {
    const url = this.url({detail: true, id, action: 'user'});
    const resp = await http.get(url);
    return {
      count: resp.data.count,
      results: resp.data.results.map(r => model.User.fromData(r)),
    };
  }
  static removeUsers(dept: model.Dept, users: model.User[]) {
    const url = this.url({detail: true, id: dept.id, action: 'user'});
    const data = {user_uids: users.map(user => user.username), subject: 'delete'};
    return http.patch(url, data).then(x => x.data);
  }
  static moveUsers(dept: model.Dept, users: model.User[], depts: model.Dept[]) {
    const url = this.url({detail: true, id: dept.id, action: 'user'});
    const data = {
      user_uids: users.map(item => item.username),
      dept_uids: depts.map(item => item.id),
      subject: 'move_out',
    };
    return http.patch(url, data).then(x => x.data);
  }
}

export class User {
  static url({detail = false, id, action} = {}) {
    let url = '/siteapi/oneid/user';
    if (detail) {
      url += `/${id}`;
    }
    if (action) {
      url += `/${action}`;
    }

    return `${url}/`;
  }

  static getImportUsersURL() {
    return '/siteapi/oneid/migration/user/csv/import/'
  }

  static async list(opt?: {page?: number, pageSize?: number, keyword?: string}) {
    const data = opt ? {params: {
      page: opt.page || 1,
      page_size: opt.pageSize || 1000,
      keyword: opt.keyword || '',
    }} : {page: 1, page_size: 1000};

    const resp = await http.get(this.url(), data);
    const results = resp.data.results.map(item => {
      const {user, nodes} = item;
      return model.User.fromData({...user, nodes});
    });
    return {
      count: resp.data.count,
      results,
    };
  }
  static async listFromIds(ids: string[]) {
    const url = '/siteapi/oneid/slice/';
    const qs = require('qs');
    const data = {
      params: {user_uids: ids},
      paramsSerializer: (params: string[]) => {
        return qs.stringify(params, {arrayFormat: 'repeat'});
      },
    };
    const resp = await http.get(url, data);
    return resp.data.users.map(i => model.User.fromData(i));
  }

  static create(user: model.User) {
    const data = {
      user: user.toData(),
      node_uids: user.nodes!.map(item => item.id),
    };

    return http.post(this.url(), data).then(x => x.data);
  }

  static async export(usernames: Array<string>) {
    const url = '/siteapi/oneid/migration/user/csv/export/';
    const data = {
      user_uids: usernames,
    };
    const resp = await http.post(url, data);
    return resp.data;
  }

  static retrieve(id) {
    const url = this.url({detail: true, id});
    return http.get(url).then((x) => {
      const {user, nodes} = x.data;
      return model.User.fromData({...user, nodes});
    });
  }

  static retrieveColleague(id) {
    const url = '/siteapi/oneid/ucenter/user' + `/${id}/`;
    return http.get(url).then((x) => {
      const user = x.data;
      const nodes = Array()
      return model.User.fromData({...user, nodes});
    });
  }

  static retrievePermSource(userName, permUID) {
    return http.get(this.url() + `${userName}/perm/${permUID}/`).then(x => {
      return {
        data: x.data,
      };
    });
  }

  static async partialUpdate(user: model.User) {
    const url = this.url({detail: true, id: user.username});
    const data = user.toData();

    const resp = await http.patch(url, data);
    await this.updateNodes(user, user.nodes);
    return resp.data;
  }
  static async updateMobile(token: string) {
    this.updateContact({sms_token: token});
  }
  static async updateEmail(token: string) {
    this.updateContact({email_token: token});
  }
  static async updateContact(data: {sms_token?: string, email_token?: string}) {
    const url = '/siteapi/oneid/ucenter/contact/';
    const resp = await http.patch(url, data);
    return resp.data;
  }

  static updateNodes(user: model.User, nodes: model.Node[]) {
    const url = this.url({detail: true, id: user.username, action: 'node'});
    const data = {node_uids: nodes.map(d => d.id), subject: 'override'};
    return http.patch(url, data).then(x => x.data);
  }
  static updateDepts(user, depts) {
    const url = this.url({detail: true, id: user.username, action: 'dept'});
    const data = {dept_uids: depts.map(d => d.id), subject: 'override'};
    return http.patch(url, data).then(x => x.data);
  }
  static updateRoles(user, roles) {
    const url = this.url({detail: true, id: user.username, action: 'group'});
    const data = {group_uids: roles.map(d => d.id), subject: 'override'};
    return http.patch(url, data).then(x => x.data);
  }
  static remove(user) {
    const url = this.url({detail: true, id: user.username});
    return http.delete(url).then(x => x.data);
  }
  static async retrievePerm(username: string, permId: string) {
    const url = `/siteapi/oneid/user/${username}/perm/${permId}/`;
    const resp = await http.get(url);
    return resp.data;
  }
}

export class App {
  static url({detail = false, id, action}: {detail?: boolean; id?: string; action?: string;} = {}) {
    let url = '/siteapi/oneid/app';
    if (detail) {
      url += `/${id}`;
    }
    if (action) {
      url += `/${action}`;
    }

    return `${url}/`;
  }

  static async list(
    params?: {
      keyword: string,
      pageSize?: number;
      page?: number;
      nodeId?: string,
      username?: string,
      ownerAccess?: boolean,
    },
  ) {
    const data = params ? {params: {
      name: params.keyword,
      node_uid: params.nodeId,
      user_uid: params.username,
      page: params.page || 1,
      page_size: params.pageSize || 10,
      owner_access: params.ownerAccess,
    }} : {};
    const resp = await http.get(this.url(), data);
    return resp.data;
  }
  static fetch(id: string) {
    return http.get(this.url({detail: true, id})).then(x => x.data);
  }
  static create(data: any) {
    return http.post(this.url(), data).then(x => x.data);
  }
  static partialUpdate(id: string, data: any) {
    return http.patch(this.url({detail: true, id}), data).then(x => x.data);
  }
  static remove(id: string) {
    return http.delete(this.url({detail: true, id})).then(x => x.data);
  }
}

export class Perm {
  static url({detail = false, id, action} = {}) {
    let url = '/siteapi/oneid/perm';
    if (detail) {
      url += `/${id}`;
    }
    if (action) {
      url += `/${action}`;
    }

    return url + '/';
  }
  static list(q) {
    const data = {params: q};
    return http.get(this.url(), data).then(x => {
      return {
        meta: {count: x.data.count},
        data: x.data.results,
      }
    });
  }

  static create(data) {
    return http.post(this.url(), data).then(x => x.data);
  }
  static partialUpdate(id, data) {
    return http.patch(this.url({detail: true, id}), data).then(x => x.data);
  }

  static partialUpdateOwnersStatus(uid, subject, params) {
    return http.patch(this.url() + `${uid}/owner/?owner_subject=${subject}&value=true`, params).then(x => x.data);
  }

  static remove(id) {
    return http.delete(this.url({detail: true, id})).then(x => x.data);
  }

  static permResultList(uid, q) {
    // const params = new URLSearchParams(q);
    const data = {params: q};
    return http.get(this.url() + `${uid}/owner`, data).then(x => {
      return {
        meta: {count: x.data.count},
        data: x.data.results,
      }
    });
  }

  static deptPermList(q) {
    const {query: {id}} = q;
    return http.get(this.url() + `dept/${id}/?action=access`).then(x => {
      return {
        meta: {count: x.data.count},
        data: x.data.results,
      };
    });
  }
  static updateDeptPerm(deptId, permId, status) {
    const data = {
      perm_statuses: [{uid: permId, status}],
    };
    return http.patch(this.url() + `dept/${deptId}/`, data).then(x => x.data);
  }
  static rolePermList(q) {
    const {query: {id}} = q;
    return http.get(this.url() + `group/${id}/?action=access`).then(x => {
      return {
        meta: {count: x.data.count},
        data: x.data.results,
      };
    });
  }
  static updateRolePerm(roleId, permId, status) {
    const data = {
      perm_statuses: [{uid: permId, status}],
    };
    return http.patch(this.url() + `group/${roleId}/`, data).then(x => x.data);
  }
  static async updateNodePerm(id: string, permId: string, status: number) {
    const url = `/siteapi/oneid/perm/node/${id}/`;
    const data = {perm_statuses: [{uid: permId, status}]};
    const resp = await http.patch(url, data);
    return resp.data;
  }
  static async groupPermList(
    id: string,
    params?: {appId?: string, action?: string, actionExcept?: string},
  ) {
    let data = {};
    if (params) {
      const {appId, action, actionExcept} = params;
      data = appId
        ? {params: {scope: appId, action_except: actionExcept}}
        : {params: {action}};
    }

    const url = `/siteapi/oneid/perm/node/${id}/`;
    const resp = await http.get(url, data);
    return resp.data;
  }
  static async userPermList(
    username: string,
    params?: {appId?: string, action?: string, actionExcept?: string},
  ) {
    let data = {};
    if (params) {
      const {appId, action, actionExcept} = params;
      data = appId
        ? {params: {scope: appId, action_except: actionExcept}}
        : {params: {action}};
    }

    const url = `${this.url()}user/${username}/`;
    const resp = await http.get(url, data);
    return resp.data;
  }
  static updateUserPerm(username, permId, status) {
    const data = {
      perm_statuses: [{uid: permId, status}],
    };
    return http.patch(this.url() + `user/${username}/`, data).then(x => x.data);
  }
}

export function getAuthList(q) {
  return http.get('/siteapi/oneid/perm/').then(resp => exchangeAuthData(resp.data));
}

export class ApiService extends API {
  static baseUrl(): string {
    return '/siteapi/oneid/service';
  }
  static async getCaptcha() {
    const url = this.url({action: 'captcha'});
    const resp = await http.get(url);
    return resp.data;
  }
  static async sendSms(username: string, mobile: string) {
    const url = this.url({action: 'sms'});
    const data = {
      username,
      mobile,
    };
    const resp = await http.post(url, data);
    return resp.data;
  }

  static async sendRegisterSms(mobile: string) {
    const url = this.url({action: 'sms/register'});
    const data = {
      mobile,
    };
    const resp = await http.post(url, data);
    return resp.data;
  }

  static async sendBindSms(mobile: string, dingId: string) {
    const url = 'http://192.168.3.49:8000/siteapi/v1/ding/bind/sms/';
    const data = {
      mobile,
    };
    const resp = await http.post(url, data);
    return resp.data;
  }

  static async verifySmsWithBind(mobile: string, smsCode: string, dingId: string) {
    const url = 'http://192.168.3.49:8000/siteapi/v1/ding/bind/sms/';
    const data = {params: {
      mobile,
      code: smsCode,
      dingId,
    }};
    const resp = await http.get(url, data);
    return resp.data;
  }

  static async sendResetPasswordSms(mobile: string, username: string) {
    const url = this.url({action: 'sms/reset_password'});
    const data = {
      mobile,
      username,
    };
    const resp = await http.post(url, data);
    return resp.data;
  }

  static async sendActivateSms(key: string) {
    const url = this.url({action: 'sms/activate_user'});
    const data = {
      key,
    };
    const resp = await http.post(url, data);
    return resp.data;
  }

  static async sendSmsToUpdateMobile(username: string, mobile: string, password: string) {
    const url = '/siteapi/oneid/service/sms/update_mobile/';
    const data = {
      username,
      mobile,
      password,
    };
    const resp = await http.post(url, data);
    return resp.data;
  }

  static async sendResetEmail(username: string, email: string) {
    const url = this.url({action: 'email/reset_password'});
    const data = {
      username,
      email
    };
    const resp = await http.post(url, data);
    return resp.data;
  }

  static async verifySmsToUpdateMobile(mobile: string, code: string) {
    const url = '/siteapi/oneid/service/sms/update_mobile/';
    const data = {params: {mobile, code}};
    const resp = await http.get(url, data);
    return resp.data;
  }

  static async sendEmailToUpdateEmail(email: string, password: string) {
    const url = '/siteapi/oneid/service/email/update_email/';
    const data = {email, password};
    const resp = await http.post(url, data);
    return resp.data;
  }
  static async retrieveEmailInfoToUpdateEmail(token: string) {
    const url = '/siteapi/oneid/service/email/update_email/';
    const data = {params: {email_token: token}};
    const resp = await http.get(url, data);
    return resp.data;
  }

  static async sendRegisterEmail(email: string) {
    const url = this.url({action: 'email/register'});
    const data = {
      email
    };
    const resp = await http.post(url, data);
    return resp.data;
  }

  static async sendActivateEmail(key: string) {
    const url = this.url({action: 'email/activate_user'});
    const data = {
      key
    };
    const resp = await http.post(url, data);
    return resp.data;
  }

  static async sendSmsWithoutCaptcha(mobile: string) {
    const url = this.url({action: 'sms'});
    const data = {mobile};
    const resp = await http.post(url, data);
    return resp.data;
  }
  static async verifySms(mobile: string, code: string) {
    const url = this.url({action: 'sms'});
    const data = {params: {mobile, code}};
    const resp = await http.get(url, data);
    return resp.data;
  }

  static async verifySmsWithType(mobile: string, code: string, type: string) {
    const url = this.url({action: 'sms/' + type});
    const data = {params: {mobile, code}};
    const resp = await http.get(url, data);
    return resp.data;
  }

  static async verifyEmail(emailToken: string, emailType: string) {
    const url = this.url({action: 'email/' + emailType});
    const data = {params: {email_token: emailToken}};
    const resp = await http.get(url, data);
    return resp.data;
  }

}

export class File {
  static baseUrl() {
    return '/siteapi/oneid/service/file/';
  }
  static headers() {
    return {
      Authorization: getAuthorization(),
    };
  }
  static url(key: string) {
    return `${this.baseUrl()}${key}`;
  }
}

export class UCenter extends API {
  static baseUrl(): string {
    return '/siteapi/oneid/ucenter';
  }

  static async partialUpdate(user: model.User) {
    const url = this.url({action: 'profile'});
    const resp = await http.patch(url, user.toData ? user.toData() : user).then(x => x.data);
    return resp;
  }

  static async retrieve() {
    const url = '/siteapi/oneid/auth/token/';
    const resp = await http.get(url);
    const user = model.User.exchangeCurrentUserData(resp.data);
    return user;
  }

  static async apps() {
    return http.get(this.url({action: 'apps'})).then(x => x.data);
  }

  static async resetPassword(params) {
    const url = this.url({action: 'password'});
    const data = params;
    const resp = await http.put(url, data);
    return resp.data;
  }

  static async resetPasswordWithOldPassword(username: string, oldPassword: string, newPassword: string) {
    const url = this.url({action: 'password'});
    const data = {
      new_password: newPassword,
      old_password: oldPassword,
      username,
    };
    const resp = await http.put(url, data);
    return resp.data;
  }

  static async verifyPassword(username: string, password: string) {
    const url = this.url({action: 'login'});
    const resp = await http.post(url, {username, password});
    return resp.data;
  }

  static async login(params) {
    const url = this.url({action: 'login'});
    const resp = await http.post(url, params);
    const {token} = resp.data;
    console.log('data', resp.data);
    window.localStorage.setItem(ONEID_TOKEN, token);
    return model.User.exchangeCurrentUserData(resp.data);
  }

  static async updateMobile(mobile: string, oldMobileSmsToken: string, newMobileSmsToken: string) {
    const url = this.url({action: 'mobile'});
    const data = {
      old_mobile_sms_token: oldMobileSmsToken,
      new_mobile_sms_token: newMobileSmsToken,
      mobile,
    };
    const resp = await http.put(url, data);
    return resp.data;
  }

  static async invite(username: string) {
    const url = `/siteapi/oneid/invitation/user/${username}/`;
    const resp = await http.post(url);
    return resp.data;
  }

  static async verifyInvite(key: string) {
    const url = '/siteapi/oneid/ucenter/profile/invited/';
    const resp = await http.get(url, {params:{key}});
    return resp.data;
  }

  static async activateWithInviteCode(q) {
    const url = '/siteapi/oneid/ucenter/profile/invited/';
    // const config = {headers: {Authorization: `token ${token}`}};
    const resp = await http.patch(url, q);
    return resp.data;
  }

  static async register(q) {
    const url = this.url({action: 'register'});
    const resp = await http.post(url, q);
    return resp.data;
  }

  static async registerWithBind(q: object) {
    const url = 'http://192.168.3.49:8000/siteapi/v1/ding/register/';
    const resp = await http.post(url, q);
    console.log('register',resp);
    return resp.data;
  }

  static async checkUserExistWithMobile(q: object) {
    const url = 'http://192.168.3.49:8000/siteapi/v1/ding/query/user/';
    const resp = await http.post(url, q);
    console.log('check',resp.data);
    return resp.data;
  }

  static async bindUserWithType(q: object) {
    const url = 'http://192.168.3.49:8000/siteapi/v1/ding/bind/';
    const resp = await http.post(url, q);
    console.log('bind', resp.data);
    const {token} = resp.data;
    console.log('token', token);
    window.localStorage.setItem(ONEID_TOKEN, token);
    return model.User.exchangeCurrentUserData(resp.data);
  }

  static async isUserBound(q: object) {
    const url = 'http://192.168.3.49:8000/siteapi/v1/dingding/qr/callback/';
    const resp = await http.post(url, q);
    console.log('bound', resp.data);
    const {token} = resp.data;
    console.log('token', token);
    if (token === '') {
      console.log('isNULL');
      return null;
    }
    // window.localStorage.setItem(ONEID_TOKEN, token);
    return model.User.exchangeCurrentUserData(resp.data);
  }
}

export const login = UCenter.login.bind(UCenter);

export function dingLogin({code}) {
  return http.post('/siteapi/oneid/ucenter/ding/login/', {code}).then((resp) => {
    const {token} = resp.data;
    window.localStorage.setItem(ONEID_TOKEN, token);
    const user = model.User.exchangeCurrentUserData(resp.data);
    return {...user, isLogin: true};
  }).catch((e) => {
    console.log(e);
  });
}

export function logout() {
  window.localStorage.removeItem(ONEID_TOKEN);
  window.cachedUser = null;
}

function ddReady() {
  return new Promise(resolve => dd.ready(resolve));
}

function ddRquestAuthCode() {
  if (!window.cachedConfig) {
    throw (Error('notConfig'));
  }
  const {corpId} = window.cachedConfig.ding;
  return new Promise(resolve => dd.runtime.permission.requestAuthCode({
    corpId,
    onSuccess: info => resolve(info),
  }));
}

async function getDingUser() {
  await ddReady();
  const {code} = await ddRquestAuthCode();
  const result = await dingLogin({code}).then((user) => {
    window.cachedUser = user;
    return user;
  });
  return result;
}

export async function getUser() {
  if (isDingtalk()) {
    return getDingUser();
  }

  const token = window.localStorage.getItem(ONEID_TOKEN);
  if (!token) {
    return Promise.resolve(null);
  }

  const user = await UCenter.retrieve();
  window.cachedUser = user;
  return user;
}

export function getCachedUser() {
  return window.cachedUser;
}

export class OperationRecord {
  static url({detail = false, id}: {detail?: boolean; id?: string;} = {}) {
    let url = '/siteapi/oneid/log';
    if (detail) {
      url += `/${id}`;
    }
    return `${url}/`;
  }

  static async list(
    params?: {
      days?: number,
      user?: string,
      summary?: string,
      subjects?: string[],
      pageSize?: number;
      page?: number;
    },
  ) {
    const {pageSize = 10, page = 1, subjects, user, days, summary, ...data} = params || {};
    data.page = page;
    data.page_size = pageSize;
    if (subjects && subjects.length) {
      data.subject = subjects.join('|');
    }
    if (user && user.length) {
      data.user = user;
    }
    if (days != undefined && days != null) {
      data.days = days;
    }
    if (summary && summary.length) {
      data.summary = summary;
    }
    const resp = await http.get(this.url(), {params: data});
    return resp.data;
  }

  static async getRecordWithDetail(id: string) {
    const resp = await http.get(this.url({detail: true, id}));
    return resp.data;
  }
}
