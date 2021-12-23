<template>
  <login-component
    v-if="isRenderLoginPage"
    :title="tenant ? tenant.name : ''"
    :icon="tenant ? tenant.icon : ''"
    :config="config"
    :complexity="tenant ? tenant.password_complexity : undefined"
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
    await this.getLoginPage()
  }

  @Watch('$route')
  tenantChange() {
    this.getLoginPage()
  }

  get tenantUUID(): string | null {
    const tenant = this.$route.query.tenant
    if (tenant) {
      if (typeof tenant === 'string') {
        return tenant
      } else {
        return tenant[0]
      }
    } else {
      return null
    }
  }

  private async getLoginPage() {
    // 登录之后进行当前登录地址的判断，如果当前登录地址有next参数，重定向到next中
    const query = this.$route.query
    let next: any = query && query.next
    if (next) {
      const keys = Object.keys(query)
      for (const key of keys) {
        if (key === 'next') continue
        next += `&${key}=${query[key]}`
      }
      if (next.indexOf('?') === -1) next = next.replace('&', '?')
      next = window.location.origin + next
      LoginStore.NextUrl = next
      if (LoginStore.token) {
        const prefix = next.includes('?') ? '&' : '?'
        window.location.replace(next + `${prefix}token=` + LoginStore.token)
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
    Object.keys(data).forEach(key => {
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
  }

  // third-party
  private extendLogin(extend: { buttons: Array<ButtonConfig>, title: string }) {
    let next = window.location.origin + getBaseUrl() + '/third_part_callback'
    if (LoginStore.NextUrl) next = `${next}&next=${LoginStore.NextUrl}`
    if (!LoginStore.ThirdUserID && !LoginStore.BindUrl && extend && extend.buttons) {
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
<style lang="scss" scoped>
</style>
