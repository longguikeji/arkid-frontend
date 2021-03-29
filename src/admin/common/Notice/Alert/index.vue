<template>
  <el-alert
    :title="state.title"
    :type="state.type"
    :closable="state.closable"
    :center="state.center"
    :description="state.description"
    :close-text="state.closeText"
    :show-icon="state.showIcon"
    :effect="state.effect"
  />
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import AlertState from './AlertState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Alert',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): AlertState {
    return this.$state as AlertState
  }
}
</script>

<style lang="scss" scoped>
</style>
