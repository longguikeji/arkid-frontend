<template>
  <login-component
    v-if="isRenderLoginPage"
    :tenant="tenant"
    :config="config"
  />
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import LoginComponent from './components/LoginComponent.vue'
import { LoginPagesConfig, LoginTenant, ButtonConfig } from './interface'
import LoginStore from './store/login'
import getBaseUrl from '@/utils/get-base-url'
import http from './http'

@Component({
  name: 'Login',
  components: {
    LoginComponent
  }
})
export default class Login extends Vue {
  private isRenderLoginPage = false
  private config: LoginPagesConfig = {}
  private tenant: LoginTenant = {}

  async mounted() {
    await this.backendAuth()
    await this.getLoginPage()
  }

  @Watch('$route')
  tenantChange() {
    this.getLoginPage()
  }

  get tenantUUID(): string | null {
    const tenant = this.$route.query.tenant
    return tenant ? (typeof tenant === 'string' ? tenant : tenant[0]) : null
  }

  get next(): string | null {
    const next = this.$route.query.next
    return next ? (typeof next === 'string' ? next : next[0]) : null
  }

  private async backendAuth() {
    const token = LoginStore.token
    if (token) return
    const data = await http.get('/api/v1/backend_auth/')
    const t = data?.data?.token
    if (!t) return
    LoginStore.token = t
    window.location.reload()
  }

  private async getLoginPage() {
    // 登录之后进行当前登录地址的判断，如果当前登录地址有next参数，重定向到next中
    let hasPermission = true
    let info = ''
    if (this.next) {
      let nextUrl = this.next
      const query = this.$route.query
      const keys = Object.keys(this.$route.query)
      for (const key of keys) {
        if (key === 'is_alert') {
          LoginStore.token = null
          hasPermission = false
          info = query[key] as string
          continue
        }
        if (key === 'next') continue
        if (nextUrl.includes(`&${key}=`)) continue
        if (nextUrl.includes(`?${key}=`)) continue
        nextUrl += `&${key}=${query[key]}`
      }
      if (nextUrl.indexOf('?') === -1) nextUrl = nextUrl.replace('&', '?')
      nextUrl = window.location.origin + nextUrl
      LoginStore.NextUrl = nextUrl
      if (LoginStore.token) {
        const prefix = nextUrl.includes('?') ? '&' : '?'
        window.location.replace(nextUrl + `${prefix}token=` + LoginStore.token)
      }
    }

    LoginStore.TenantUUID = this.tenantUUID
    let url = '/api/v1/loginpage/'
    if (LoginStore.TenantUUID) {
      url = '/api/v1/loginpage/?tenant=' + LoginStore.TenantUUID
    }
    const response = await http.get(url)
    const page = response.data
    const { tenant, data } = page
    const config = {}
    Object.keys(data).forEach((key) => {
      if (key === 'login') {
        config[key] = {
          ...data[key],
          extend: this.extendLogin(data[key].extend)
        }
      } else {
        config[key] = data[key]
      }
    })
    this.config = config
    this.tenant = tenant
    this.isRenderLoginPage = true

    if (!hasPermission) {
      this.$message({
        message: info as string,
        type: 'error',
        showClose: true,
        duration: 3000
      })
    }
  }

  // third-party
  private extendLogin(extend: { buttons: Array<ButtonConfig>, title: string }) {
    let next = window.location.origin + getBaseUrl() + '/third_part_callback'
    if (LoginStore.NextUrl) next = `${next}&next=${LoginStore.NextUrl}`
    if (
      !LoginStore.ThirdUserID &&
      !LoginStore.BindUrl &&
      extend &&
      extend.buttons
    ) {
      extend.buttons.forEach((btn: ButtonConfig) => {
        btn.img = btn.img || 'extend-icon'
        btn.redirect!.params = {
          next: encodeURIComponent(next)
        }
      })
      return extend
    } else {
      return null
    }
  }
}
</script>
