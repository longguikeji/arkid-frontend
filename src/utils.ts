import uuid from 'uuid/v4';


export const uuidHex = () => (
  uuid(null, [] as number[])
    .map(x => x.toString(16).padStart(2, '0'))
    .join('')
);

// sleep - `await sleep(1.2)` 休眠 1.2秒
export const sleep = (seconds: number) => new Promise(res => setTimeout(() => res(true), seconds * 1000));

// FIXME: use raf
export const sleepRaf = (seconds: number) => new Promise(res => setTimeout(() => res(true), seconds * 1000));

// TODO: 简化
export function fmtTime(time: Date) {
  return `${
    'getFullYear,getMonth,getDate'.split(',').map(
      // @ts-ignore
      x => String(time[x]() + (x === 'getMonth' ? 1 : 0)).padStart(2, '0'),
    ).join('-')
  } ${
    'getHours,getMinutes,getSeconds'.split(',').map(
      // @ts-ignore
      x => String(time[x]()).padStart(2, '0'),
    ).join(':')
  }`;
}

export function findTreeNode<T>(treeNodes: LG.TreeChild<T>, fn: (node: LG.TreeNode<T>)=>boolean) {
  const nodes = [...treeNodes];
  let result = null;

  while (nodes.length > 0) {
    const cur = nodes.pop();
    if (!cur) {
      continue;
    }

    if (fn(cur)) {
      result = cur;

      break;
    }

    if ('children' in cur && Array.isArray(cur.children)) {
      nodes.push(...cur.children);
    }
  }

  return result;
}

export function findTreePath(tree: any, fn: any) {
  const nodes = [tree];
  let target = null;

  while(nodes.length > 0) {
    const cur = nodes.shift();

    if (fn(cur)) {
      target = cur;
      break;
    }
  
    if (cur.children.length > 0) {
      cur.children.forEach((n: any) => {n.parent = cur});
      nodes.push(...cur.children);
    }
  }

  let result = [];
  if (target) {
    while(true) {
      result.push(target);
      if (target.parent) {
        target = target.parent;
      } else {
        break;
      }
    }
  }

  result.forEach(n => {delete n.parent});

  return result.reverse();
}

export class MsgPipe {
  key: string;
  target: Window;
  fns: {
    [k: string]: any[];
  };
  // (this.fns[type] || (this.fns[type] = [])).push(fn);
  _unwatch?: () => any;

  constructor({key, target}: {key: string; target: Window}) {
    this.key = key;
    this.target = target;
    this.fns = {};

    window.addEventListener('message', (ev) => {
      if (ev && ev.data && ev.data.$key === key) {
        // noop
      } else {
        return;
      }

      this.handleMessage(ev.data);
    }, false);
  }

  send(msg: object) {
    this.target.postMessage({
      ...msg,
      $key: this.key,
    }, '*');
  }

  on(type: string, fn: LG.Fn) {
    (this.fns[type] || (this.fns[type] = [])).push(fn);
  }

  handleMessage(data: {type: string}) {
    (this.fns[data.type] || []).forEach(fn => {
      fn(data);
    });
  }

  // TODO: rpc() {}
}

export function loadCss(css: string) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = css;

  /*
  link.onerror = function (e) {
    link.onerror = link.onload = null;
    reject(e);
  };

  link.onload = function () {
    link.onerror = link.onload = null;
    resolve();
  };
  */

  document.body.previousElementSibling!.appendChild(link);
  // document.getElementsByTagName('head')[0].
}


export function dragOverClass(
  ev: MouseEvent,
  opt: {isAdd: boolean & 'leave', cls: string, silent: boolean},
) {
  const {isAdd, cls = 'drag-over', silent = false} = opt;
  // console.log('drag', ev.type, ev.target, ev.relatedTarget, ev.currentTarget);

  try {
    const dropEl = ev.currentTarget as Element;

    if (typeof(isAdd) === 'boolean') {
      dropEl.classList[isAdd ? 'add' : 'remove'](cls);
    } else if (isAdd === 'leave') {
      const relatedTarget = ev.relatedTarget as Element;
      if (!dropEl.contains(relatedTarget)) {
        dropEl.classList.remove(cls);
      }
    } else {
      throw new Error(`invalid isAdd: ${isAdd}, only: true/false/'leave'`);
    }
  } catch (ex) {
    if (silent) {
      console.warn('dragOverClass err', ex);
    } else {
      throw ex;
    }
  }
}

export function readFile(f: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = evt => {
      const body = reader.result as string;
      resolve(body);
    };
    reader.onerror = (ex) => {
      reject(ex);
    };
    reader.readAsText(f);
  });
}


function addNameToDataURL(dataURL: string, name: string): string {
  return dataURL.replace(';base64', `;name=${name};base64`);
}


type ProcessResult = {dataURL: string; name: string; size: number; type: string};
export function processFile(file: File, {fillName = true} = {}): Promise<ProcessResult> {
  const { name, size, type } = file;
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = event => {
      const data = reader.result as string;
      resolve({
        dataURL: fillName ? addNameToDataURL(data, name) : data,
        name,
        size,
        type,
      });
    };
    reader.readAsDataURL(file);
  });
}


export function isDingtalk() {
  // @ts-ignore
  return !!window.dingtalk;
}


export function pDefer(): {promise: Promise<any>; resolve: any; reject: any} {
  const deferred: any = {};

  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return deferred;
}


/**
 * childrenFn > childrenKey
 *
 * fn: (node, ctx, pNode) => void;
 *   ctx: {
 *     index: 1,
 *     level: 0,
 *   }
 *
 * walkTree([], (node, ctx, pNode) => {
 * });
 */
export function walkTree(
  root,
  fn,
  {
    childrenFn = null,
    childrenKey = 'children',
    childFirst = false,
    rootAsChildren = false,
    skipRoot = false,
    ctx = {},
    level = 0,
  } = {}
) {
  if (childrenFn === null) {
    childrenFn = node => node[childrenKey];
  }

  let processNode = (node, pNode, level, index) => {
    if (!childFirst) {
      ctx.level = level;
      ctx.index = index;
      fn(node, ctx, pNode);
    }

    processChildren(node, level);

    if (childFirst) {
      ctx.level = level;
      ctx.index = index;
      fn(node, ctx, pNode);
    }
  };
  let processChildren = (pNode, level) => {
    let children = childrenFn(pNode);
    if (children && children.length) {
      children.forEach((node, index) => processNode(node, pNode, level + 1, index));
    }
  };

  if (rootAsChildren) {
    if (root && root.length) {
      root.forEach((node, index) => processNode(node, null, level, index));
    }
  } else {
    if (skipRoot) {
      processChildren(root, level);
    } else {
      processNode(root, null, level, -1);
    }
  }
}

const getRegexRule = (message: string, regex: RegExp) => {
  return {
    trigger: 'blur', validator: (rule: any, value: string, cb: any) => {
      if (regex.test(value) || !value) {
        cb();
      } else {
        cb(new Error(message));
      }
    }
  };
};

export const FORM_RULES = {
  required: { required: true, message: '必填项', trigger: 'blur' },
  username: getRegexRule('4到16位（小写字母，数字）', /^[a-z0-9]{4,16}$/),
  name: getRegexRule('2到16位（汉字，字母，数字，下划线，减号）', /^[\w\u4e00-\u9fa5_-]{2,16}$/),
  mobile: getRegexRule('手机号码格式有误', /^(1)\d{10}$/),
  email: getRegexRule('邮箱格式有误', /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/),
  port: getRegexRule(
    '端口格式有误',
    /^([1-9]\d{0,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])(-([1-9]\d{0,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5]))?$/
  ),
  password: {type: 'string', min: 6, message: '请确认密码长度至少6位', trigger: 'blur'},
};
