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
import { LoginPagesConfig, LoginPageConfig, LoginTenant, ButtonConfig } from './interface'
import LoginStore from './store/login'
import { jsonp } from 'vue-jsonp'

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
    LoginStore.TenantUUID = this.tenantUUID
    let url = '/api/v1/loginpage/'
    if (LoginStore.TenantUUID) {
      url = '/api/v1/loginpage/?tenant=' + LoginStore.TenantUUID
    }
    const params = {
      url,
      method: 'get'
    }
    const { data, tenant } = await jsonp('/api/v1/jsonp', params)
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

  private extendLogin(extend: { buttons: Array<ButtonConfig>, title: string }) {
    if (!LoginStore.ThirdUserID && !LoginStore.BindUrl && extend && extend.buttons) {
      extend.buttons.forEach(btn => {
        btn.redirect!.params = {
          next: encodeURIComponent('http://' + window.location.host + '/third_part_callback')
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
