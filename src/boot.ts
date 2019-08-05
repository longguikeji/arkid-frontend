import Vue, { ComponentOptions, PluginObject, VueConstructor } from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import {loadCss} from './utils';

import {TypeDialog} from './xcomps/XUI';


function rvnodePlugin(V: typeof Vue) {
  V.component('r-vnode', {
    functional: true,
    props: {vnodes: Object},
    render(h, ctx) {
      return ctx.props.vnodes;
    },
  });
}

interface BootOpt {
  App: ComponentOptions<Vue> | VueConstructor;
  routes: RouteConfig[];
  plugins?: PluginObject<any>[];
  css?: string[];
}


declare module "vue/types/vue" {
  interface Vue {
    /** 执行 fn 并自动提示成功&失败 */
    $doAction<T>(fn: () => T, opt?: any): T;

    $ui: {
      showDialog(data: TypeDialog): Promise<any>;
      showConfirm(data: {title?: string; content?: string}): Promise<boolean>;
    };

  }
}

export function boot({App, routes, plugins = [], css = []}: BootOpt) {
  const allPlugins = ([
    routes && VueRouter,  // 稍微有些重，所以必要的情况下才引入
    listOptions,
    rvnodePlugin
  ] as any[]).concat(plugins).filter(Boolean);

  allPlugins.forEach(x => Vue.use(x));

  Vue.prototype.$doAction = function<T>(fn: () => T, opt?: any): T|void {
    const handleEx = (ex: any) => {
      this.$Message.error(String(ex));
    };

    try {

      const ret = fn();

      if (ret && typeof (ret as any).then === 'function') {
        (ret as any).then(null, handleEx);
      }

      return ret;

    } catch(ex) {
      handleEx(ex);
    }
  };

  const RootApp: any = routes ? {
    router: new VueRouter({
      routes,
    }),
    render: (h: any) => h(App),
  } : App;

  css.forEach(loadCss);

  return new Vue(RootApp).$mount('#app');
}


/**
 * {
 *   listOptions: {
 *     a: [1],
 *   },
 * }
 * {
 *   listOptions: {
 *     a: [2],
 *     b: [3, 4],
 *   },
 * }
 *
 * -> {
 *   listOptions: {
 *     a: [1, 2],
 *     b: [3, 4],
 *   },
 * }
 */
interface ListOpt {[k: string]: any[];}

function listOptions(V: typeof Vue) {
  V.config.optionMergeStrategies.listOptions = function (parent: ListOpt, child: ListOpt, vm: any) {
    const opts: ListOpt = {};
    Object.entries(parent || {}).forEach(([key, val]) => {
      opts[key] = [...val];
    });
    Object.entries(child || {}).forEach(([key, val]) => {
      (opts[key] || (opts[key] = [])).push(...val);
    });

    return opts;
  };
}

export function installComps(comps: object, vue = Vue) {
  Object.entries(comps).forEach(([key, comp]) => vue.component(key, comp));
}

