<template>
  <el-tag
    :type="state.type"
    :closable="state.closable"
    :disable-transitions="state.disableTransitions"
    :hit="state.hit"
    :color="state.color"
    :size="state.size"
    :effect="state.effect"
    class="tag-item"
    @close="handleClose(tag)"
  >
    {{ state.value }}
  </el-tag>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import TagState from './TagState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Tag',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): TagState {
    return this.$state as TagState
  }
}
</script>

<style lang="scss" scoped>
.tag-item {
  margin-left: 5px;
}
.new-tag-input {
  display: inline-block;
  width: 90px;
  margin-left: 5px;
  height: 28px;
  vertical-align: bottom;
  ::v-deep .el-input__inner {
    height: 100% !important;
  }
}
.new-tag-button {
  display: inline-block;
  margin-left: 5px;
  padding: 5px;
  vertical-align: bottom;
}
</style>
