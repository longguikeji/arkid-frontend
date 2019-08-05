import {walkTree} from '../utils';
import lodash from 'lodash';

function renderMenus(h, menus, level = 0) {
  return menus.map(menu => renderMenu(h, menu, level + 1));
}

function renderMenu(h, {
  menus, groupTitle, title, icon, badge, ...props
}, level = 0) {
  const buildTitleChildren = () => {
    const children = [title];
    if (icon && typeof icon === 'string') {
      children.unshift(h('Icon', {props: {type: icon}}));
    }

    if (!badge) {
      return children;
    } else {
      return [h('Badge', {props: badge}, children)];
    }
  };

  if (!menus) {
    return h('MenuItem', {
      props,
    }, buildTitleChildren());
  }

  if (groupTitle) {
    return h('MenuGroup', {
      props: {title: groupTitle, ...props},
    }, renderMenus(h, menus, level));
  }

  return h('Submenu', {
    props,
  }, [
    h('template', {slot: 'title'}, buildTitleChildren())
  ].concat(renderMenus(h, menus, level)));
}

export default {
  props: {
    data: Object,
    menuParentKey: {
      type: String,
      default: '$$parent',
    },
    menuItemMapKey: {
      type: String,
      default: '$$menuItemMap',
    },
  },

  data() {
    return {
      openedNames: [],
      menuOpened: [],
    };
  },

  computed: {
    menus() {
      const {menus} = this.data;
      if (menus) {
        const map = {};

        walkTree(menus, (node, {}, pNode) => {
          if (pNode) {
            Object.defineProperty(node, this.menuParentKey, {
              enumerable: false,
              configurable: true,
              value: pNode,
            });
          }

          const isMenuItem = !node.menus && !node.groupTitle;
          if (isMenuItem) {
            map[node.name] = node;
          }
        }, {rootAsChildren: true, childrenKey: 'menus'});

        Object.defineProperty(menus, this.menuItemMapKey, {
          enumerable: false,
          configurable: true,
          value: map,
        });
      }

      return menus;
    },
  },

  watch: {
    'data.activeName': {
      handler(name) {
        this.updateOpenedNames(name);
      },
    },

    'data.openNames': {
      immediate: true,
      handler(newNames) {
        this.openedNames = newNames || [];
      },
    },
    openedNames() {
      this.$nextTick(() => {
        this.$refs.menu.updateOpened();
      });
    },
  },

  mounted() {
    this.updateOpenedNames(this.data.activeName);
  },

  methods: {
    onMenuOpenChange(names) {
      this.menuOpened = names;
    },
    onSelect(name) {
      this.updateOpenedNames(name);
    },

    getOpenedNamesByActiveName(name) {
      const names = [];

      const menuItem = name ? this.menus[this.menuItemMapKey][name] : null;
      if (menuItem) {
        let p = menuItem;
        while ((p = p[this.menuParentKey])) {
          if (!p.groupTitle && p.name) {
            names.push(p.name);
          }
        }
      }

      return names;
    },

    updateOpenedNames(name) {
      const names = this.getOpenedNamesByActiveName(name);
      const newNames = this.data.accordion ? names : lodash.union(this.openedNames, names);
      if (JSON.stringify(this.openedNames) !== JSON.stringify(newNames) ||
        // 此处逻辑可能有问题，当前menu 的 open 可能需要 union merge
        JSON.stringify(this.menuOpened) !== JSON.stringify(newNames)
      ) {
        this.openedNames = newNames;
      }
    },
  },

  render(h) {
    const {data} = this;
    if (!data || !data.menus) {
      return null;
    }

    const {menus, onSelect, onOpenChange, openNames, ...props} = data;
    const on = {
      'on-select': name => {
        this.onSelect(name);
        onSelect && onSelect(name);
      },
      'on-open-change': (names) => {
        this.onMenuOpenChange(names);
        onOpenChange && onOpenChange(names);
      },
    };

    props.openNames = this.openedNames;

    return h('Menu', {
      props,
      on,
      ref: 'menu',
    }, renderMenus(h, menus));
  },
};