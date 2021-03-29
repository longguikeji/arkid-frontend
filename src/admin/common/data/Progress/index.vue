<template>
  <el-progress
    :percentage="state.value"
    :type="state.type"
    :stroke-width="state.strokeWidth"
    :text-inside="state.textInside"
    :status="state.status"
    :width="state.width"
    :show-text="state.showText"
    :stroke-linecap="state.strokeLinecap"
    :color="state.color"
    :format="state.format"
  />
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ProgressState from './ProgressState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Progress',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): ProgressState {
    return this.$state as ProgressState
  }
}
</script>

<style lang="scss" scoped>
</style>
