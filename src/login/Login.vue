<template>
  <login-slug v-if="slugisnull" />
  <login-component
    v-else-if="config"
    :tenant="tenant"
    :config="config"
  />
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import LoginComponent from './components/LoginComponent.vue'
import LoginSlug from './components/LoginSlug.vue'
import { LoginPagesConfig, LoginTenant } from './interface'
import { backendAuth, getLoginPage } from './utils'
import LoginStore from './store'

@Component({
  name: 'Login',
  components: {
    LoginComponent,
    LoginSlug
  }
})
export default class Login extends Vue {
  private config: LoginPagesConfig | null = null
  private tenant: LoginTenant = {}

  async mounted() {
    await backendAuth()
    await this.initLoginPage()
  }

  @Watch('$route')
  tenantChange() {
    this.initLoginPage()
  }

  get slugisnull(): boolean {
    const sl = this.$route.query.slug
    const res = sl ? (typeof sl === 'string' ? sl : sl[0]) : null
    return res === 'null'
  }

  get uuid(): string | null {
    const tenant = this.$route.query.tenant
    return tenant ? typeof tenant === 'string' ? tenant : tenant[0] : null
  }

  async initLoginPage() {
    if (this.slugisnull) return
    LoginStore.TenantUUID = this.uuid
    await getLoginPage(this.$route).then(({ tenant, config }) => {
      if (tenant) this.tenant = tenant
      if (config) this.config = config
    })
  }
}
</script>
