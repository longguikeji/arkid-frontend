<template>
  <el-steps
    :active="state.active"
    :direction="state.direction"
    :simple="state.simple"
    :align-center="state.alignCenter"
    :finish-status="state.finishStatus"
    :process-status="state.processStatus"
    :space="state.space"
  >
    <el-step
      v-for="(item, index) in state.step"
      :key="index"
      :title="item.title"
      :description="item.description"
      :status="item.status"
      :icon="item.icon"
    />
  </el-steps>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import StepsState from './StepsState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Steps',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): StepsState {
    return this.$state as StepsState
  }
}
</script>

<style lang="scss" scoped>
</style>
