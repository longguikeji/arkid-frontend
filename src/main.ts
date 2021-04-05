import Vue, { DirectiveOptions } from 'vue'

import 'normalize.css'
import ElementUI from 'element-ui'
import SvgIcon from 'vue-svgicon'
import VueCropper from 'vue-cropper'
import '@/styles/element-variables.scss'
import '@/styles/index.scss'
import App from '@/App.vue'
import store from '@/store'
import { AppModule } from '@/store/modules/app'
import i18n from '@/lang'
import '@/icons/components'
import '@/utils/error-log'
import '@/pwa/register-service-worker'
import TablePage from '@/admin/TablePage/index.vue'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import '@/arkfbp'
import OpenAPI from './config/openapi'
import './admin'


OpenAPI.instance.init('/api/schema?format=json').then(async() => {
  init()
})

function init() {
  const router = require('@/router').default
  Vue.use(mavonEditor)
  Vue.use(ElementUI, {
    size: AppModule.size, // Set element-ui default size
    i18n: (key: string, value: string) => i18n.t(key, value)
  })
  Vue.use(VueCropper)
  Vue.use(SvgIcon, {
    tagName: 'svg-icon',
    defaultWidth: '1em',
    defaultHeight: '1em'
  })

  Vue.config.productionTip = false

  Vue.component('TablePage', TablePage)

  new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
  }).$mount('#app')
}