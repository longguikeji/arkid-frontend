<template>
  <div
    id="app"
  >
    <router-view />
    <service-worker-update-popup />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import ServiceWorkerUpdatePopup from './pwa/components/ServiceWorkerUpdatePopup.vue'
import { GlobalValueModule } from '@/store/modules/global-value'
import { removeToken } from '@/utils/auth'

@Component({
  name: 'App',
  components: {
    ServiceWorkerUpdatePopup
  }
})
export default class extends Vue {
  private beforeUnloadTime
  private interval

  get closePageAutoLogout() {
    return GlobalValueModule.closePageAutoLogout
  }

  mounted() {
    window.addEventListener('beforeunload', () => this.beforeunloadHandler())
    window.addEventListener('unload', () => this.unloadHandler())
  }

  destroyed() {
    window.removeEventListener('beforeunload', () => this.beforeunloadHandler())
    window.removeEventListener('unload', () => this.unloadHandler())
  }

  beforeunloadHandler() {
    this.beforeUnloadTime = new Date().getTime()
  }

  async unloadHandler() {
    this.interval = new Date().getTime() - this.beforeUnloadTime
    if (this.interval <= 5 && this.closePageAutoLogout) {
      removeToken()
    }
  }
}
</script>
