<template>
  <component
    :is="item"
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
