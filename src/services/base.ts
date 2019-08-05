import {isArray, isNumber, isFunction, indexOf} from 'lodash';
import axios, { AxiosResponse } from 'axios';
import Cookie from 'js-cookie';
import {uuidHex} from '../utils';

export const ONEID_TOKEN = 'oneid';

export const getUuid = () => uuidHex();

export class API {
  static baseUrl(): string {
    throw Error('should override baseUrl');
  }
  static url(options: {detail?: boolean, id?: string, action?: string}): string {
    let url = this.baseUrl();
    if (options.detail) {
      url += `/${options.id}`;
    }
    if (options.action) {
      url += `/${options.action}`;
    }
    return `${url}/`;
  }
}

export {axios};

export const http = axios.create({
  headers: {
    common: {
      'X-Requested-With': 'XMLHttpRequest',
    }
  }
});

export const getToken = () =>  window.localStorage.getItem(ONEID_TOKEN);
export const getAuthorization = () => `Token ${getToken()}`;

http.interceptors.request.use(config => {
  if (config.headers.common['Authorization']) {
    return config;
  }
  const token = window.localStorage.getItem(ONEID_TOKEN);
  if (token) {
    config.headers.common['Authorization'] = 'token ' + token;
  }
  return config;
});

export function injectLoginRequired(cb: (x: AxiosResponse | Error | any) => any) {
  function getRes(obj) {
    let res = obj.response;
    if (res) {
      return res;
    } else {
      return obj;
    }
  }

  http.interceptors.response.use(resp => {
    const {status, data} = getRes(resp);
    if (status === 401 || (data && data.status === 401)) {
      cb(resp);

      return Promise.reject(resp);
    }

    return resp;
  }, error => {
    const {status, data} = getRes(error) || {};

    if (status === 401 || (data && data.status === 401)) {
      cb(error);
    }

    return Promise.reject({status, data});
  });
}


function makeRejectReason({type, resp, http, msg}) {
  return {
    type,

    ...(resp ? {
      msg: (resp.message || resp.msg || '') + (resp.err ? `; err: ${resp.err}` : ''),
      status: resp.status,
      code: resp.code,
      httpStatus: http.status,
      http,
    } : {}),

    ...(msg ? {
      msg,
    } : {}),
  };
}

export function process({list = false} = {}) {
  const fnList = x => ({
    meta: {count: x.count},
    data: x.results.slice(),
  });

  const fn = list ? fnList : (x => x);

  return function(resp) {
    if (resp.data/* && resp.data.status === 'success'*/) {
      return fn(resp.data);
    } else {
      throw new Error();
    }
  };
}

/**
 * export function getItems() {
 *   return delay(() => ({data: {}}));
 * }
 */
export function delayIt(fn, {delay = 100} = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(fn());
      } catch (ex) {
        reject(ex);
      }
    }, delay);
  });
}


export function makeRpc(baseUrl: string): any {
  return function rpc(method: any, params: any): any {
    return http.post(baseUrl, {
      method,
      params,
    }).then(resp => resp.data);
  };
}
