<template>
  <div
    v-if="openAPIInited"
    id="app"
  >
    <router-view />
    <service-worker-update-popup />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import ServiceWorkerUpdatePopup from './pwa/components/ServiceWorkerUpdatePopup.vue'
// import { GetUserAuthFlow } from './flows/getUserAuth'
import { runFlowByFile } from '@/arkfbp/index'
import OpenAPI from '@/config/openapi'

@Component({
  name: 'App',
  components: {
    ServiceWorkerUpdatePopup
  }
})
export default class extends Vue {
  private openAPIInited = false

  @Watch('$route')
  onRouteChange(r) {
    // this.init()
  }

  getUserInfo() {
    // runWorkflow(new GetUserAuthFlow(), { store: this.$store })
  }

  isnotEmpty(obj: any) {
    if (typeof obj === 'undefined' || obj === null || obj === '') {
      return false
    } else {
      return true
    }
  }

  async created() {
    await this.setCurrentTenant()
    this.openAPIInited = true
    // if (this.isnotEmpty(localStorage.getItem('userToken'))) {
    //   this.getUserInfo()
    // } else {
    //   this.$router.push('/login')
    // }
  }

  async setCurrentTenant() {
    await runFlowByFile('flows/tenant/setCurrentTenant', {
      route: this.$route,
      router: this.$router
    })
  }

  init() {
    const path = this.$route.path
    if (path !== '/login' && !this.openAPIInited) {
      OpenAPI.instance.init('/api/schema?format=json').then(async() => {
        await this.setCurrentTenant()
        this.openAPIInited = true
      })
    }
  }
}
</script>
