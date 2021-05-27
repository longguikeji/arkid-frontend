import {Component, Mixins, Prop, Vue, Watch} from 'vue-property-decorator'

import {Config} from '@/models/config'
import {Config as ConfigService} from '@/services/config'
import {File} from '@/services/oneid'
import LoginMixin from './loginMixin'

import './App.less'
import {buildStyle} from './user/utils'

declare module 'vue/types/vue' {
  interface Vue {
    $app: App
    $fileUrl(key: string): string
  }
}

@Component({
  components: {
  },

  template: html`
  <div>
    <router-view />
  </div>
  `,

})
export default class App extends Mixins(LoginMixin) {
  metaInfo: Config|null = null

  loading:boolean = false

  created() {

    this.$options._base.prototype.$app = this

    this.$options._base.prototype.$fileUrl = (key: string) => File.url(key)

    this.metaInfo = ConfigService.cachedMeta()

    if (!this.metaInfo) {
      throw new Error('init fail')
    }

    if (this.metaInfo.org.color) {
      this.createStyle(this.metaInfo.org.color)
    }
  }

  createStyle(color: string) {
    const el = this.styleEl = document.createElement('style')
    el.textContent = buildStyle(color)
    document.body.appendChild(el)
  }

  beforeDestroy() {
    try {
      if (this.styleEl && this.styleEl.parentNode) {
        this.styleEl.parentNode.removeChild(this.styleEl)
        this.styleEl = null
      }
    } catch(ex){
      throw new Error(ex)
    }
  }

  goHome() {
    this.$router.push({
      name: 'home',
    })
  }

}
