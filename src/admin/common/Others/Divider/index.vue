<template>
  <el-divider
    :direction="state.direction"
    :content-position="state.contentPosition"
  >
    {{ state.value }}
  </el-divider>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import DividerState from './DividerState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Divider'
})
export default class extends Mixins(BaseVue) {
  get state(): DividerState {
    return this.$state as DividerState
  }
}
</script>
<style lang="scss" scoped></style>
