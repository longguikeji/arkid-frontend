import './XIcon.less';

export default {
  props: {
    name: String,

    xl: Boolean,
    xs: Boolean,
    l: Boolean,
    s: Boolean,
    md: {type: Boolean, default: true},
    inline: {type: Boolean, default: true}, // name ~ f- 有效

    className: {type: String, default: ''},
    styles: {type: Object, default: () => ({})},
    size: {type: String,},  // w+h  vs.  fontSize
    // xs, s, md, l, xl
  },

  data() {
    return {
      svg: '',
    };
  },

  computed: {
    iconName() {
      let s = 'md';
      for (let k of ['xl', 'xs', 'l', 's']) {
        if (this[k]) {
          s = k;
          break;
        }
      }
      return `x-icon x-icon-${this.name} x-icon--${s}`;
    },

    inlineSvg() {
      return this.inline && this.name.indexOf('f-') === 0;
    },
  },

  created() {
    this.$watch('name', val => {
      this.svg = '';
      if (this.inlineSvg) {
        const url = require('../assets/icons/auto/f-' + val.replace(/^f-/, '') + '.svg');
        fetch(url)
          .then(x => x.text().then(x => x.trim()))
          .then(svg => {
            if (val === this.name) {
              this.svg = svg;
            }
          });
      }
    }, {immediate: true});
  },

  render(h: any): any {
    return this.inlineSvg ? h('span', {
      class: 'x-icon--inline-svg',
      style: this.size ? {fontSize: this.size} : null,
      domProps: {
        innerHTML: this.svg,
      },
      on: {
        click: () => {this.$emit('click')},
      },
    }) : h('i', {
      class: `${this.iconName} ${this.className}`,
      style: {...(this.size ? {width: this.size, height: this.size} : {}), ...this.styles},
      on: {
        click: () => {this.$emit('click')},
      },
    });
  },

};
