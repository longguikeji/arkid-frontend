const clickoutsideContext = '@@clickoutsideContext';

const ClickOutside = {
  name: 'click-outside',
  bind(el: any, binding: any, vnode: any) {
    const documentHandler = (e: any) => {
      if (!vnode.context || el.contains(e.target)) {
        return false;
      }
      if (binding.expression) {
        vnode.context[el[clickoutsideContext].methodName](e)
      } else {
        el[clickoutsideContext].bindingFn(e);
      }
    };

    el[clickoutsideContext] = {
      documentHandler,
      methodName: binding.expression,
      bindingFn: binding.value
    };

    setTimeout(() => {
      document.addEventListener('click', documentHandler);
    }, 0);
  },

  update(el: any, binding: any) {
    el[clickoutsideContext].methodName = binding.expression;
    el[clickoutsideContext].bindingFn = binding.value;
  },

  unbind(el: any) {
    document.removeEventListener('click', el[clickoutsideContext].documentHandler);
  },
};

const directives = {
  ClickOutside,
};

export default {
  install(Vue: any) {
    Object.keys(directives).forEach(key => {
      Vue.directive(directives[key].name, directives[key]);
    });
  }
}
