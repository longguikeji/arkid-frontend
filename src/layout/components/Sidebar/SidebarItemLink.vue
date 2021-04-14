<template>
  <a
    v-if="isExternal(to)"
    :href="to"
    target="_blank"
    rel="noopener"
  >
    <slot />
  </a>
  <router-link
    v-else
    :to="toTarget()"
  >
    <slot />
  </router-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { isExternal } from '@/utils/validate'
import { TenantModule } from '@/store/modules/tenant'

@Component({
  name: 'SidebarItemLink'
})
export default class extends Vue {
  @Prop({ required: true }) private to!: string

  private isExternal = isExternal

  get currentTenant() {
    return TenantModule.currentTenant
  }

  private toTarget() {
    if (this.to.includes('system') || TenantModule.currentSlugIsValid) {
      return {
        path: this.to
      }
    } else {
      return {
        path: this.to,
        query: {
          tenant: this.currentTenant.uuid
        }
      }
    }
  }
}
</script>
