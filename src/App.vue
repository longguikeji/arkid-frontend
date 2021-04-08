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
import { runFlowByFile } from '@/arkfbp/index'
import OpenAPI from '@/config/openapi'

@Component({
  name: 'App',
  components: {
    ServiceWorkerUpdatePopup
  }
})
export default class extends Vue {

}
</script>
