<template>
  <login-component
    v-if="isRenderLoginPage"
    :title="tenant ? tenant.name : ''"
    :icon="tenant ? tenant.icon : ''"
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
import request from './request'

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

  @Watch('$route.query.tenant')
  tenantChange() {
    this.getLoginPage()
  }

  get tenantUUID() {
    return this.$route.query.tenant
  }

  private async getLoginPage() {
    // 登录之后进行当前登录地址的判断，如果当前登录地址有next参数，重定向到next中
    const query = this.$route.query
    if (query.next) {
      let nextUrl = query.next
      Object.keys(query).forEach(key => {
        if (key !== 'next' && key !== 'tenant') {
          nextUrl += ('&' + key + '=' + query[key])
        }
      })
      nextUrl = window.location.origin + nextUrl
      LoginStore.NextUrl = nextUrl
      if (LoginStore.token) {
        window.location.replace(nextUrl + '&token=' + LoginStore.token)
      }
    }

    LoginStore.TenantUUID = this.tenantUUID
    let url = '/api/v1/loginpage/'
    if (LoginStore.TenantUUID) {
      url = '/api/v1/loginpage/?tenant=' + LoginStore.TenantUUID
    }
    const response = await request.get(url)
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
    // set tenant or arkid password-complexity
    const passwordComplexity = tenant.password_complexity
    LoginStore.passwordComplexity = {
      regex: new RegExp(passwordComplexity.regular || ''),
      hint: passwordComplexity.title
    }
  }

  // third-party
  private extendLogin(extend: { buttons: Array<ButtonConfig>, title: string }) {
    if (!LoginStore.ThirdUserID && !LoginStore.BindUrl && extend && extend.buttons) {
      extend.buttons.forEach((btn: ButtonConfig) => {
        btn.img = btn.img || 'extend-icon'
        btn.redirect!.params = {
          next: encodeURIComponent(window.location.origin + getBaseUrl() + '/third_part_callback')
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
