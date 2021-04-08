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
import { LoginPagesConfig, LoginPageConfig, LoginTenant } from './interface'
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
    console.log('login:', LoginStore.TenantUUID)
    let url = '/api/v1/loginpage/'
    if (LoginStore.TenantUUID) {
      url = '/api/v1/loginpage/?tenant=' + LoginStore.TenantUUID
    }
    const params = {
      url,
      method: 'get'
    }
    const { data, tenant } = await jsonp('/api/v1/jsonp', params)
    this.config = data
    this.tenant = tenant
    this.isRenderLoginPage = true
  }
}
</script>
<style lang="scss" scoped>
</style>
