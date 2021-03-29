<template>
  <el-badge
    v-if="state.state && state.state.badge"
    :value="state.state.badge.value"
    :max="state.state.badge.max"
    :is-dot="state.state.badge.idDot"
    :hidden="state.state.badge.hidden"
    :type="state.state.badge.type"
  >
    <component :is="item" />
  </el-badge>
  <component
    :is="item"
    v-else
  />
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import AdminComponentState from './AdminComponentState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'AdminComponent',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): AdminComponentState {
    return this.$state as AdminComponentState
  }

  get item(): object {
    const state = this.state
    return {
      render: (h: Function) => {
        return h(state.type, {
          props: {
            path: this.getChildPath('state')
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-badge__content.is-fixed {
  z-index: 100 !important;
}
</style>
